import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/modules/app.module';
import { before } from 'node:test';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { PrismaService } from '../../src/services/prisma.service';

describe('Watchlist', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let agent: ReturnType<typeof request.agent>;

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
  });

  it('should add a watchlist item', async () => {
    return await agent
      .post('/watchlist/add')
      .send({
        stock_symbol: 'AAPL',
      })
      .expect(201)
      .expect({
        success: true,
        message: `AAPL successfully added to watchlist`,
      });
  });

  it('should not add a watchlist item (conflict)', async () => {
    return await agent
      .post('/watchlist/add')
      .send({
        stock_symbol: 'AAPL',
      })
      .expect(409)
      .expect({
        message: 'Stock already exists in watchlist',
        error: 'Conflict',
        statusCode: 409,
      });
  });

  // it('should not add a watchlist item (wrongly typed data)', async () => {
  //   return await agent
  //     .post('/watchlist/add')
  //     .send({
  //       stock_symbol: '1234',
  //     })
  //     .expect(400)
  //     .expect({
  //       message: ['string must be a string'],
  //       error: 'Bad Request',
  //       statusCode: 400,
  //     });
  // });

  it('should retrieve watchlist items', async () => {
    const response = await agent.get('/watchlist/watchlist').expect(200);

    expect(response.body.data).toBeDefined();
  });

  it('should delete a watchlist item', async () => {
    return await agent
      .delete('/watchlist/delete')
      .send({
        stock_symbol: 'AAPL',
      })
      .expect(200)
      .expect({
        success: true,
        message: `AAPL successfully deleted from watchlist`,
      });
  });

  it('should not delete a watchlist item (does not exist)', async () => {
    return await agent
      .post('/watchlist/delete')
      .send({
        stock_symbol: 'AAPL',
      })
      .expect(404)
      .expect({
        message: 'Cannot POST /watchlist/delete',
        error: 'Not Found',
        statusCode: 404,
      });
  });

  // it('should not delete a watchlist item (wrongly typed data)', async () => {
  //   return await agent
  //     .post('/watchlist/delete')
  //     .send({
  //       stock_symbol: '1234',
  //     })
  //     .expect(400)
  //     .expect({
  //       message: ['string must be a string'],
  //       error: 'Bad Request',
  //       statusCode: 400,
  //     });
  // });

  it('should not retrieve watchlist items (no data)', async () => {
    return await agent.get('/watchlist/watchlist').expect(200).expect({
      data: [],
    });
  });

  before(async () => {
    await agent.post('auth/logout');
  });

  it('should reject the unauthenticated request trying to retrieve the watchlist', async () => {
    await request(app.getHttpServer()).get('/users/me').expect(401);
  });

  it('should reject the unauthenticated request trying to add a watchlist item', async () => {
    await request(app.getHttpServer()).post('/watchlist/add').expect(401);
  });

  it('should reject the unauthenticated request trying to delete a watchlist item', async () => {
    await request(app.getHttpServer()).delete('/watchlist/delete').expect(401);
  });

  afterAll(async () => {
    await request(app.getHttpServer()).post('/auth/logout'); // backup

    await prisma.watchlist.deleteMany({});

    await app.close();
  });
});
