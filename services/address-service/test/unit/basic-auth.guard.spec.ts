import { UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { BasicAuthGuard } from '../../src/common/guards/basic-auth.guard';

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

  it('canActivate() ->missing header -> throws UnauthorizedException (401)', () => {
    expect(() => guard.canActivate(ctx({}))).toThrow(UnauthorizedException);
  });

  it('canActivate() ->wrong scheme -> throws UnauthorizedException (401)', () => {
    expect(() => guard.canActivate(ctx({ authorization: 'Bearer x' }))).toThrow(
      UnauthorizedException,
    );
  });

  it('canActivate() ->basic but no ":" in decoded -> throws UnauthorizedException (401)', () => {
    const token = Buffer.from('admin', 'utf8').toString('base64');
    expect(() =>
      guard.canActivate(ctx({ authorization: `Basic ${token}` })),
    ).toThrow(UnauthorizedException);
  });

  it('canActivate() ->wrong creds -> throws UnauthorizedException (401)', () => {
    expect(() =>
      guard.canActivate(ctx({ authorization: basic('admin', 'wrong') })),
    ).toThrow(UnauthorizedException);
  });

  it('canActivate() ->correct creds -> returns true', () => {
    expect(
      guard.canActivate(ctx({ authorization: basic('admin', 'admin') })),
    ).toBe(true);
  });

  it('canActivate() ->supports Authorization header casing -> returns true', () => {
    expect(
      guard.canActivate(ctx({ Authorization: basic('admin', 'admin') })),
    ).toBe(true);
  });
});
