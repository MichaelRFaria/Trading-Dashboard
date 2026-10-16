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
        email: 'test-user-trade@email.com',
        password: 'testtest1!',
      })
      .expect(200);

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email: 'test-user-trade@email.com',
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

  it('should not get gains (user has no trades)', async () => {
    return await agent.get('/trade/gains').expect(404).expect({
      message: 'Gains can not be retrieved, you have made no trades.',
      error: 'Not Found',
      statusCode: 404,
    });
  });

  it('should not get history (user has no trades)', async () => {
    return await agent.get('/trade/history').expect(404).expect({
      message:
        'History was not retrieved. Either make some trades or change the search filters.',
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

    it('should get gains', async () => {
      const response = await agent.get('/trade/gains').expect(200);

      expect(response.body.realised_gains).toEqual(expect.any(Number));
      expect(response.body.unrealised_gains).toEqual(expect.any(Number));
    });

    it('should get history', async () => {
      const response = await agent.get('/trade/history').expect(200);

      expect(response.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            stock_symbol: 'AAPL',
          }),
        ]),
      );
    });

    it('should get history (filter valid)', async () => {
      const response = await agent
        .get('/trade/history')
        .query({
          stock_symbol: 'AAPL',
        })
        .expect(200);

      expect(response.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            stock_symbol: 'AAPL',
          }),
        ]),
      );
    });

    it('should not get history (filter invalid)', async () => {
      return await agent
        .get('/trade/history')
        .query({
          stock_symbol: 'NON-EXISTENT',
        })
        .expect(404)
        .expect({
          message:
            'History was not retrieved. Either make some trades or change the search filters.',
          error: 'Not Found',
          statusCode: 404,
        });
    });

    afterEach(async () => {
      await prisma.trade.deleteMany({
        where: { user_id: testUserId },
      });

      await prisma.holding.deleteMany({
        where: { user_id: testUserId },
      });
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

    await prisma.trade.deleteMany({
      where: { user_id: testUserId },
    });

    await prisma.holding.deleteMany({
      where: { user_id: testUserId },
    });

    await app.close();
  });
});
