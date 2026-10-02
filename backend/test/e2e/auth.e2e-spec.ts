import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/modules/app.module';

describe('Auth', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('should login a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'testuser@email.com',
        password: 'TestPassword123!',
      });

    expect(response.status).toBe(200);
    expect(response.body.access_token).toEqual(expect.any(String));
  });

  it('should logout a user', () => {
    return request(app.getHttpServer())
      .post('/auth/logout')
      .expect(200)
      .expect({
        success: true,
        message: 'Successfully logged out',
      });
  });

  it('should clear the access token cookie', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/logout')
      .expect(200);

    expect(response.headers['set-cookie']).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
