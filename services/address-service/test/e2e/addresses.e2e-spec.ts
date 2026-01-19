import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { requestIdMiddleware } from '../../src/common/middleware/request-id.middleware';
import { HttpLoggingInterceptor } from '../../src/common/logging/http-logging.interceptor';
import { AllExceptionsFilter } from '../../src/common/filters/all-exceptions.filter';

import { AddressesServiceModule } from 'src/addresses-service.module';

function basicAuthHeader(user: string, pass: string) {
  const token = Buffer.from(`${user}:${pass}`, 'utf8').toString('base64');
  return `Basic ${token}`;
}

describe('Address Service (e2e) /addresses + logging', () => {
  let app: INestApplication;

  const USER = 'admin';
  const PASS = 'admin';

  beforeAll(async () => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});

    process.env.BASIC_AUTH_USER = USER;
    process.env.BASIC_AUTH_PASS = PASS;

    const moduleRef = await Test.createTestingModule({
      imports: [AddressesServiceModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.use(requestIdMiddleware);
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.useGlobalInterceptors(app.get(HttpLoggingInterceptor));
    app.useGlobalFilters(app.get(AllExceptionsFilter));

    await app.init();
  });

  afterAll(async () => {
    await app.close();
    (Logger.prototype.log as any).mockRestore?.();
    (Logger.prototype.error as any).mockRestore?.();
  });

  const studentId = '11111111-1111-4111-8111-111111111111';

  it('GET without auth -> 401', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/addresses/${studentId}`)
      .expect(401);

    expect(res.headers['x-request-id']).toBeDefined();
    expect(res.body).toEqual(
      expect.objectContaining({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Missing or invalid Auth',
        path: `/api/addresses/${studentId}`,
        requestId: expect.any(String),
        timestamp: expect.any(String),
      }),
    );
  });

  it('PUT with auth -> 200', async () => {
    const res = await request(app.getHttpServer())
      .put(`/api/addresses/${studentId}`)
      .set('Authorization', basicAuthHeader('admin', 'admin'))
      .send({ address: '1111 Budapest, Fő utca 1.' })
      .expect(200);

    expect(res.body).toEqual({
      id: studentId,
      address: '1111 Budapest, Fő utca 1.',
    });
  });

  it('GET with auth -> 200', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/addresses/${studentId}`)
      .set('Authorization', basicAuthHeader('admin', 'admin'))
      .expect(200);

    expect(res.body).toEqual({
      id: studentId,
      address: '1111 Budapest, Fő utca 1.',
    });
  });

  it('GET non-existing with auth -> 404', async () => {
    const other = '22222222-2222-4222-8222-222222222222';
    const res = await request(app.getHttpServer())
      .get(`/api/addresses/${other}`)
      .set('Authorization', basicAuthHeader('admin', 'admin'))
      .expect(404);

    expect(res.body).toEqual(
      expect.objectContaining({
        statusCode: 404,
        error: 'Not Found',
        message: 'Address not found',
        path: `/api/addresses/${other}`,
        requestId: expect.any(String),
        timestamp: expect.any(String),
      }),
    );
  });

  it('PUT invalid body -> 400', async () => {
    const res = await request(app.getHttpServer())
      .put(`/api/addresses/${studentId}`)
      .set('Authorization', basicAuthHeader('admin', 'admin'))
      .send({ address: '' })
      .expect(400);

    expect(res.body).toEqual(
      expect.objectContaining({
        statusCode: 400,
        error: 'Bad Request',
        path: `/api/addresses/${studentId}`,
        requestId: expect.any(String),
        timestamp: expect.any(String),
        message: expect.any(Array),
      }),
    );
  });

  it('GET echoes x-request-id when provided', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/addresses/${studentId}`)
      .set('Authorization', basicAuthHeader('admin', 'admin'))
      .set('x-request-id', 'demo-xyz')
      .expect(200);

    expect(res.headers['x-request-id']).toBe('demo-xyz');
  });
});
