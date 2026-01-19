import { UnauthorizedException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { BasicAuthGuard } from 'src/common/guards/basic-auth.guard';

function ctx(headers: Record<string, any>): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ headers }),
    }),
  } as any;
}

function basic(user: string, pass: string) {
  const token = Buffer.from(`${user}:${pass}`, 'utf8').toString('base64');
  return `Basic ${token}`;
}

describe('BasicAuthGuard', () => {
  const config = {
    get: jest.fn((key: string, def?: string) => {
      if (key === 'BASIC_AUTH_USER') return 'admin';
      if (key === 'BASIC_AUTH_PASS') return 'admin';
      return def;
    }),
  } as any;

  let guard: BasicAuthGuard;

  beforeEach(() => {
    guard = new BasicAuthGuard(config);
  });

  it('missing header -> 401', () => {
    expect(() => guard.canActivate(ctx({}))).toThrow(UnauthorizedException);
  });

  it('wrong scheme -> 401', () => {
    expect(() => guard.canActivate(ctx({ authorization: 'Bearer x' }))).toThrow(
      UnauthorizedException,
    );
  });

  it('basic but no ":" in decoded -> 401', () => {
    const token = Buffer.from('admin', 'utf8').toString('base64');
    expect(() =>
      guard.canActivate(ctx({ authorization: `Basic ${token}` })),
    ).toThrow(UnauthorizedException);
  });

  it('wrong creds -> 401', () => {
    expect(() =>
      guard.canActivate(ctx({ authorization: basic('admin', 'wrong') })),
    ).toThrow(UnauthorizedException);
  });

  it('correct creds -> true', () => {
    expect(
      guard.canActivate(ctx({ authorization: basic('admin', 'admin') })),
    ).toBe(true);
  });

  it('supports Authorization header casing -> true', () => {
    expect(
      guard.canActivate(ctx({ Authorization: basic('admin', 'admin') })),
    ).toBe(true);
  });
});
