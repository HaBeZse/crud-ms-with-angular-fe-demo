import { lastValueFrom, of } from 'rxjs';
import { HttpLoggingInterceptor } from '../../src/common/logging/http-logging.interceptor';

describe('HttpLoggingInterceptor (profile)', () => {
  it('intercept() -> logs JSON with requestId/path/statusCode/durationMs', async () => {
    const interceptor = new HttpLoggingInterceptor('test-service');
    const logSpy = jest
      .spyOn((interceptor as any).logger, 'log')
      .mockImplementation(() => {});

    const ctx: any = {
      switchToHttp: () => ({
        getRequest: () => ({
          requestId: 'rid-1',
          method: 'GET',
          originalUrl: '/api/students',
        }),
        getResponse: () => ({ statusCode: 200 }),
      }),
    };

    const next: any = { handle: () => of({ ok: true }) };

    await lastValueFrom(interceptor.intercept(ctx, next));
    await new Promise<void>((r) => setImmediate(r));

    expect(logSpy).toHaveBeenCalledTimes(1);
    const arg = String(logSpy.mock.calls[0][0]);
    const parsed = JSON.parse(arg);
    expect(parsed).toEqual(
      expect.objectContaining({
        service: 'test-service',
        requestId: 'rid-1',
        method: 'GET',
        path: '/api/students',
        statusCode: 200,
      }),
    );
    expect(typeof parsed.durationMs).toBe('number');

    logSpy.mockRestore();
  });
});
