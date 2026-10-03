import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';

describe('Users', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);

    app = module.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  it('should register a user', async () => {
    return request(app.getHttpServer())
      .post('/users/register')
      .send({
        email: 'new-user-1@email.com',
        password: 'TestPassword123!',
      })
      .expect(201)
      .expect({
        success: true,
        message: 'Successfully registered an account',
      });
  });

  it('should not register a user', async () => {
    return request(app.getHttpServer())
      .post('/users/register')
      .send({
        email: 'old-user-1@email.com',
        password: 'testtest1!',
      })
      .expect(409)
      .expect({
        message: 'A user with this email already exists',
        error: 'Conflict',
        statusCode: 409,
      });
  });

  it('should not register a user', async () => {
    return request(app.getHttpServer())
      .post('/users/register')
      .send({
        email: 'not-an-email',
        password: 'testtest1!',
      })
      .expect(400)
      .expect({
        message: ['email must be an email'],
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('should not register a user', async () => {
    return request(app.getHttpServer())
      .post('/users/register')
      .send({
        email: 'new-user-2@email.com',
        password: 'test1!',
      })
      .expect(400)
      .expect({
        message: ['password must be longer than or equal to 8 characters'],
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('should not register a user', async () => {
    return request(app.getHttpServer())
      .post('/users/register')
      .send({
        email: 'new-user-3@email.com',
        password: 'testtesttesttesttesttesttesttest1!',
      })
      .expect(400)
      .expect({
        message: ['password must be shorter than or equal to 30 characters'],
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('should not register a user', async () => {
    return request(app.getHttpServer())
      .post('/users/register')
      .send({
        email: 'new-user-4@email.com',
        password: 'testtest!',
      })
      .expect(400)
      .expect({
        message: ['Password must contain at least one number'],
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('should not register a user', async () => {
    return request(app.getHttpServer())
      .post('/users/register')
      .send({
        email: 'new-user-5@email.com',
        password: 'testtest1',
      })
      .expect(400)
      .expect({
        message: ['Password must contain at least one special character'],
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          not: 'old-user-1@email.com',
        },
      },
    });

    await app.close();
  });
});
