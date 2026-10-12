import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import cookieParser from 'cookie-parser';
import request from 'supertest';

describe('Trade', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let agent: ReturnType<typeof request.agent>;
  let testUserId: number;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);

    app = module.createNestApplication();

    app.use(cookieParser());

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();

    // agent for cookie persistence (all watchlist endpoints are protected by AuthGuard)
    agent = request.agent(app.getHttpServer());

    await agent
      .post('/auth/login')
      .send({
        email: 'old-user-1@email.com',
        password: 'testtest1!',
      })
      .expect(200);

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email: 'old-user-1@email.com',
      },
    });

    testUserId = user.id;
  });

  it('should not sell holding (no holding to sell)', async () => {
    return await agent
      .post('/trade/sell')
      .send({
        stock_symbol: 'AAPL',
        quantity: 5,
      })
      .expect(404)
      .expect({
        message: 'You do not own any shares of AAPL',
        error: 'Not Found',
        statusCode: 404,
      });
  });

  it('should not sell holding (invalid quantity to sell - dto class validator)', async () => {
    return await agent
      .post('/trade/sell')
      .send({
        stock_symbol: 'AAPL',
        quantity: 0,
      })
      .expect(400)
      .expect({
        message: ['quantity must not be less than 1e-8'],
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('should not sell holding (wrongly typed property - dto class validator)', async () => {
    return await agent
      .post('/trade/sell')
      .send({
        stock_symbol: 1234,
        quantity: 5,
      })
      .expect(400)
      .expect({
        message: ['stock_symbol must be a string'],
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('should not sell holding (wrongly typed property - dto class validator)', async () => {
    return await agent
      .post('/trade/sell')
      .send({
        stock_symbol: 'AAPL',
        quantity: '5',
      })
      .expect(400)
      .expect({
        message: [
          'quantity must not be less than 1e-8',
          'quantity must be a number conforming to the specified constraints',
        ],
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('should not buy holding (invalid quantity to buy - dto class validator)', async () => {
    return await agent
      .post('/trade/buy')
      .send({
        stock_symbol: 'AAPL',
        quantity: 0,
      })
      .expect(400)
      .expect({
        message: ['quantity must not be less than 1e-8'],
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('should not buy holding (non-existent stock ticker)', async () => {
    return await agent
      .post('/trade/buy')
      .send({
        stock_symbol: 'NON-EXISTENT',
        quantity: 5,
      })
      .expect(404)
      .expect({
        message: 'NON-EXISTENT price not found',
        error: 'Not Found',
        statusCode: 404,
      });
  });

  describe('when the user owns stocks', () => {
    beforeEach(async () => {
      // Create a holding before these tests run
      await agent
        .post('/trade/buy')
        .send({
          stock_symbol: 'AAPL',
          quantity: 5,
        })
        .expect(200);
    });

    it('should sell holding', async () => {
      const response = await agent
        .post('/trade/sell')
        .send({
          stock_symbol: 'AAPL',
          quantity: 3,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toEqual(expect.any(String));
    });

    it('should not sell holding (sell quantity is greater than owned quantity)', async () => {
      return await agent
        .post('/trade/sell')
        .send({
          stock_symbol: 'AAPL',
          quantity: 6,
        })
        .expect(400)
        .expect({
          message: 'Insufficient shares. You own 5 shares of AAPL',
          error: 'Bad Request',
          statusCode: 400,
        });
    });

    it('should sell holding (and deleting holding from holdings)', async () => {
      const response = await agent
        .post('/trade/sell')
        .send({
          stock_symbol: 'AAPL',
          quantity: 5,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toEqual(expect.any(String));

      const holding = await prisma.holding.findUnique({
        where: {
          user_id_stock_symbol: {
            user_id: testUserId,
            stock_symbol: 'AAPL',
          },
        },
      });

      expect(holding).toBeNull();
    });

    afterEach(async () => {
      await prisma.holding.deleteMany({});
      await prisma.trade.deleteMany({});
    });
  });

  it('should buy holding ', async () => {
    const response = await agent
      .post('/trade/buy')
      .send({
        stock_symbol: 'AAPL',
        quantity: 5,
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toEqual(expect.any(String));
  });

  afterAll(async () => {
    await request(app.getHttpServer()).post('/auth/logout'); // backup

    await prisma.holding.deleteMany({});
    await prisma.trade.deleteMany({});

    await app.close();
  });
});
