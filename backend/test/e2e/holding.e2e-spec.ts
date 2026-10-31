import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { Prisma } from '@prisma/client';

describe('Holdings', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let agent: ReturnType<typeof request.agent>;
  let testUserId: number;
  let selectedAccountId: number;
  let originalBalance: Prisma.Decimal;

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
        email: 'test-user-holding@email.com',
        password: 'testtest1!',
      })
      .expect(200);

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email: 'test-user-holding@email.com',
      },
    });

    testUserId = user.id;

    const account = await prisma.account.findFirstOrThrow({
      where: { user_id: testUserId, selected: true },
    });
    selectedAccountId = account.id;
    originalBalance = account.balance;
  });

  it('should not retrieve holdings (no holdings to retrieve)', async () => {
    return await agent.get('/holdings/holdings').expect(404).expect({
      message: 'No holdings found',
      error: 'Not Found',
      statusCode: 404,
    });
  });

  it('should retrieve no price changes (no holdings)', async () => {
    return await agent.get('/holdings/price-changes').expect(200).expect({
      data: [],
    });
  });

  describe('when holdings exist', () => {
    beforeAll(async () => {
      // ensure account has enough funds to purchase holding for tests
      await agent.post('/account/deposit').send({ amount: 100000 }).expect(200);
      // Create a holding before these tests run
      await agent
        .post('/trade/buy')
        .send({
          stock_symbol: 'AAPL',
          quantity: 5,
        })
        .expect(200);
    });

    it('should successfully retrieve holdings', async () => {
      const response = await agent.get('/holdings/holdings').expect(200);

      console.log(response.body);

      expect(response.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            stock_symbol: 'AAPL',
          }),
        ]),
      );
    });

    it('should retrieve price changes ', async () => {
      const response = await agent.get('/holdings/price-changes').expect(200);

      console.log(response.body);

      expect(response.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            stock_symbol: 'AAPL',
          }),
        ]),
      );
    });
  });

  afterAll(async () => {
    await request(app.getHttpServer()).post('/auth/logout'); // backup

    await prisma.trade.deleteMany({
      where: { user_id: testUserId },
    });

    await prisma.holding.deleteMany({
      where: { user_id: testUserId },
    });

    await prisma.account.update({
      where: { id: selectedAccountId },
      data: { balance: originalBalance },
    });

    await app.close();
  });
});
