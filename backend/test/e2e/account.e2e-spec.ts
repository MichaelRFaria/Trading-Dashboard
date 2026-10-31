import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import cookieParser from 'cookie-parser';
import request from 'supertest';

describe('Accounts', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let agent: ReturnType<typeof request.agent>;
  let testUserId: number;
  let testAccountId: number;
  let allAccountIds: number[];

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

    // Keep the authenticated session for the protected account endpoints.
    agent = request.agent(app.getHttpServer());

    await agent
      .post('/auth/login')
      .send({
        email: 'test-user-account@email.com',
        password: 'testtest1!',
      })
      .expect(200);

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email: 'test-user-account@email.com',
      },
    });

    testUserId = user.id;

    // no unique constraint on (user_id, selected), but there is partial unique index (no more than one row per user_id where selected = true)
    // tldr: findFirst in this case works as findUnique
    const account = await prisma.account.findFirstOrThrow({
      where: { user_id: testUserId, selected: true },
    });

    testAccountId = account.id;

    // get all selected accounts
    const allAccounts = await prisma.account.findMany({
      where: { selected: true },
    });

    allAccountIds = allAccounts.map((account) => account.id);
  });

  it('should return the user accounts', async () => {
    const response = await agent.get('/account/accounts').expect(200);

    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ user_id: testUserId }),
      ]),
    );
  });

  it('should reject a deposit below the minimum amount', async () => {
    await agent
      .post('/account/deposit')
      .send({ amount: 0 })
      .expect(400)
      .expect({
        message: ['amount must not be less than 0.01'],
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('should reject a withdrawal below the minimum amount', async () => {
    await agent
      .post('/account/withdraw')
      .send({ amount: 0 })
      .expect(400)
      .expect({
        message: ['amount must not be less than 0.01'],
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('should reject a withdrawal greater than the selected balance', async () => {
    const selectedAccount = await prisma.account.findFirstOrThrow({
      where: { id: testAccountId },
    });
    const amount = Number(selectedAccount.balance) + 1000;

    await agent
      .post('/account/withdraw')
      .send({ amount })
      .expect(400)
      .expect({
        message: `Insufficient amount to withdraw. The account balance is $${selectedAccount.balance.toString()}, you cannot withdraw $${amount}`,

        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('should reject a non-numeric deposit amount', async () => {
    await agent
      .post('/account/deposit')
      .send({ amount: 'invalid' })
      .expect(400)
      .expect({
        message: [
          'amount must not be less than 0.01',
          'amount must be a number conforming to the specified constraints',
        ],
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('should reject unexpected deposit body properties', async () => {
    await agent
      .post('/account/deposit')
      .send({ amount: 1, extra: true })
      .expect(400)
      .expect({
        message: ['property extra should not exist'],
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('should reject an invalid account id in the update body', async () => {
    await agent
      .put('/account/update')
      .send({ account_id: 'invalid' })
      .expect(400)
      .expect({
        message: [
          'account_id must be a number conforming to the specified constraints',
        ],
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('should reject deleting the only account', async () => {
    const accounts = await prisma.account.findMany({
      where: { user_id: testUserId },
    });

    if (accounts.length > 1) {
      // delete all other accounts belonging to the user
      await prisma.account.deleteMany({
        where: { id: { not: testAccountId }, user_id: testUserId },
      });
    }

    await agent
      .delete('/account/delete')
      .send({ account_id: testAccountId })
      .expect(400)
      .expect({
        message: 'You cannot delete your only account',
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('should reject unexpected update body properties', async () => {
    await agent
      .put('/account/update')
      .send({ account_id: 1, extra: true })
      .expect(400)
      .expect({
        message: ['property extra should not exist'],
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('should reject deleting an account that does not belong to the user', async () => {
    await agent
      .delete('/account/delete')
      .send({ account_id: -1 })
      .expect(404)
      .expect({
        message: 'Account -1 not found',
        error: 'Not Found',
        statusCode: 404,
      });
  });

  it('should reject an invalid account id in the delete body', async () => {
    await agent
      .delete('/account/delete')
      .send({ account_id: 'invalid' })
      .expect(400)
      .expect({
        message: [
          'account_id must be a number conforming to the specified constraints',
        ],
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('should deposit into the selected account', async () => {
    await agent
      .post('/account/deposit')
      .send({ amount: 25 })
      .expect(200)
      .expect({ success: true, message: 'Successfully deposited $25' });
  });

  it('should withdraw from the selected account', async () => {
    await agent
      .post('/account/withdraw')
      .send({ amount: 10 })
      .expect(200)
      .expect({ success: true, message: 'Successfully withdrew $10' });
  });

  it('should create an account', async () => {
    await agent
      .post('/account/create')
      .expect(201)
      .expect({ message: 'Successfully created new account' });
  });

  it('should update the selected account', async () => {
    await agent.post('/account/create').expect(201);
    const accounts = await prisma.account.findMany({
      where: { user_id: testUserId, selected: false },
    });
    const accountToSelect = accounts[0];

    await agent
      .put('/account/update')
      .send({ account_id: accountToSelect.id })
      .expect(200)
      .expect({
        message: `Successfully updated selected account to account ${accountToSelect.id}`,
      });

    const selected = await prisma.account.findFirstOrThrow({
      where: { user_id: testUserId, selected: true },
    });
    expect(selected.id).toBe(accountToSelect.id);
  });

  afterAll(async () => {
    await request(app.getHttpServer()).post('/auth/logout'); // backup

    await prisma.account.deleteMany({
      where: {
        id: {
          notIn: allAccountIds,
        },
      },
    });

    await prisma.account.update({
      where: { id: testAccountId },
      data: { balance: 0, selected: true },
    });

    await app.close();
  });
});
