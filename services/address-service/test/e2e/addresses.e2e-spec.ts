import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { randomUUID } from 'crypto';

import { AddressesServiceModule } from '../../src/addresses-service.module';

function basicAuth(user: string, pass: string) {
  const token = Buffer.from(`${user}:${pass}`, 'utf8').toString('base64');
  return `Basic ${token}`;
}

describe('Address Service (e2e) /addresses', () => {
  let app: INestApplication;
  let ds: DataSource;

  const USER = 'admin';
  const PASS = 'admin';

  beforeAll(async () => {
    process.env.BASIC_AUTH_USER = USER;
    process.env.BASIC_AUTH_PASS = PASS;

    const moduleRef = await Test.createTestingModule({
      imports: [AddressesServiceModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );

    await app.init();

    ds = app.get(DataSource);
  });

  beforeEach(async () => {
    await ds.query('TRUNCATE TABLE address.addresses');
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET without auth -> 401', async () => {
    await request(app.getHttpServer())
      .get(`/api/addresses/${randomUUID()}`)
      .expect(401);
  });

  it('PUT with auth -> 200, then GET -> 200', async () => {
    const studentId = randomUUID();

    await request(app.getHttpServer())
      .put(`/api/addresses/${studentId}`)
      .set('Authorization', basicAuth(USER, PASS))
      .send({ address: '1111 Budapest, Fő utca 1.' })
      .expect(200);

    const res = await request(app.getHttpServer())
      .get(`/api/addresses/${studentId}`)
      .set('Authorization', basicAuth(USER, PASS))
      .expect(200);

    expect(res.body.id).toBe(studentId);
    expect(res.body.address).toBe('1111 Budapest, Fő utca 1.');
  });

  it('GET non-existing with auth -> 404', async () => {
    await request(app.getHttpServer())
      .get(`/api/addresses/${randomUUID()}`)
      .set('Authorization', basicAuth(USER, PASS))
      .expect(404);
  });

  it('PUT invalid body -> 400', async () => {
    const studentId = randomUUID();
    await request(app.getHttpServer())
      .put(`/api/addresses/${studentId}`)
      .set('Authorization', basicAuth(USER, PASS))
      .send({ address: '' })
      .expect(400);
  });

  it('GET invalid uuid -> 400', async () => {
    await request(app.getHttpServer())
      .get('/api/addresses/not-a-uuid')
      .set('Authorization', basicAuth(USER, PASS))
      .expect(400);
  });
});
