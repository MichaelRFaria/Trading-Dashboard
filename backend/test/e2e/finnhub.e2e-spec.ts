import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/modules/app.module';
import request from 'supertest';
import cookieParser from 'cookie-parser';

describe('Finnhub', () => {
  let app: INestApplication;
  let agent: ReturnType<typeof request.agent>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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

  it('should retrieve stock information about AAPL', async () => {
    return await agent
      .get('/finnhub/symbol-lookup')
      .query({
        stock_symbol: 'AAPL',
      })
      .expect(200)
      .expect({
        description: 'APPLE INC',
        stock_symbol: 'AAPL',
        type: 'Common Stock',
      });
  });

  it('should not retrieve stock information', async () => {
    return await agent
      .get('/finnhub/symbol-lookup')
      .query({
        stock_symbol: 'NON-EXISTENT',
      })
      .expect(404)
      .expect({
        message: 'NON-EXISTENT not found',
        error: 'Not Found',
        statusCode: 404,
      });
  });

  it("should retrieve AAPL's current stock price", async () => {
    const response = await agent
      .get('/finnhub/price')
      .query({
        stock_symbol: 'AAPL',
        type: 'current',
      })
      .expect(200);

    expect(response.body.price).toEqual(expect.any(Number));
  });

  it("should retrieve AAPL's daily price change", async () => {
    const response = await agent
      .get('/finnhub/price')
      .query({
        stock_symbol: 'AAPL',
        type: 'change',
      })
      .expect(200);

    expect(response.body.price).toEqual(expect.any(Number));
  });

  it('should not retrieve stock price', async () => {
    return await agent
      .get('/finnhub/price')
      .query({
        stock_symbol: 'NON-EXISTENT',
        type: 'current',
      })
      .expect(404)
      .expect({
        message: 'NON-EXISTENT price not found',
        error: 'Not Found',
        statusCode: 404,
      });
  });

  afterAll(async () => {
    await request(app.getHttpServer()).post('/auth/logout'); // backup

    await app.close();
  });
});
