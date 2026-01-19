import { Test } from '@nestjs/testing';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { randomUUID } from 'crypto';

import { ProfileServiceModule } from 'src/profile-service.module';
import { AllExceptionsFilter } from 'src/common/filters/all-exceptions.filter';
import { HttpLoggingInterceptor } from 'src/common/logging/http-logging.interceptor';
import { requestIdMiddleware } from 'src/common/middleware/request-id.middleware';

describe('Profile Service (e2e) /students', () => {
  let app: INestApplication;
  let ds: DataSource;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ProfileServiceModule],
    }).compile();

    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.use(requestIdMiddleware);
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.useGlobalInterceptors(app.get(HttpLoggingInterceptor));
    app.useGlobalFilters(app.get(AllExceptionsFilter));

    await app.init();

    ds = app.get(DataSource);
  });

  beforeEach(async () => {
    await ds.query('TRUNCATE TABLE profile.students');
  });

  afterAll(async () => {
    await app.close();
    (Logger.prototype.log as any).mockRestore?.();
    (Logger.prototype.error as any).mockRestore?.();
  });

  it('GET /api/students -> 200 []', async () => {
    await request(app.getHttpServer())
      .get('/api/students')
      .expect(200)
      .expect([]);
  });

  it('POST /api/students -> 201 + body', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/students')
      .send({ name: 'Lajos', email: 'lajos@example.com' })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Lajos');
    expect(res.body.email).toBe('lajos@example.com');
  });

  it('POST invalid email -> 400', async () => {
    await request(app.getHttpServer())
      .post('/api/students')
      .send({ name: 'Bad', email: 'not-an-email' })
      .expect(400);
  });

  it('POST duplicate email -> 409', async () => {
    await request(app.getHttpServer())
      .post('/api/students')
      .send({ name: 'A', email: 'dup@example.com' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/students')
      .send({ name: 'B', email: 'dup@example.com' })
      .expect(409);
  });

  it('PUT existing -> 200', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/students')
      .send({ name: 'A', email: 'a@example.com' })
      .expect(201);

    const id = created.body.id;

    const updated = await request(app.getHttpServer())
      .put(`/api/students/${id}`)
      .send({ name: 'A2', email: 'a2@example.com' })
      .expect(200);

    expect(updated.body.id).toBe(id);
    expect(updated.body.name).toBe('A2');
    expect(updated.body.email).toBe('a2@example.com');
  });

  it('PUT non-existing -> 404', async () => {
    await request(app.getHttpServer())
      .put(`/api/students/${randomUUID()}`)
      .send({ name: 'X', email: 'x@example.com' })
      .expect(404);
  });

  it('DELETE existing -> 204, then 404', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/students')
      .send({ name: 'A', email: 'a@example.com' })
      .expect(201);

    const id = created.body.id;

    await request(app.getHttpServer())
      .delete(`/api/students/${id}`)
      .expect(204);

    await request(app.getHttpServer())
      .delete(`/api/students/${id}`)
      .expect(404);
  });

  it('GET /api/students echoes x-request-id', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/students')
      .set('x-request-id', 'demo-123')
      .expect(200);

    expect(res.headers['x-request-id']).toBe('demo-123');
  });

  it('POST invalid returns ErrorResponseDto shape', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/students')
      .send({ name: 'Bad', email: 'not-an-email' })
      .expect(400);

    expect(res.body).toEqual(
      expect.objectContaining({
        statusCode: 400,
        error: 'Bad Request',
        path: '/api/students',
        timestamp: expect.any(String),
        requestId: expect.any(String),
        message: expect.any(Array),
      }),
    );
  });
});
