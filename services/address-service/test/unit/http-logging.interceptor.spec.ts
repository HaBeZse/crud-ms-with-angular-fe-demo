import { lastValueFrom, of } from 'rxjs';
import { HttpLoggingInterceptor } from '../../src/common/logging/http-logging.interceptor';

describe('HttpLoggingInterceptor (address)', () => {
  it('intercept() -> logs JSON with requestId/path/statusCode/durationMs', async () => {
    const interceptor = new HttpLoggingInterceptor('address-service-test');
    const logSpy = jest
      .spyOn((interceptor as any).logger, 'log')
      .mockImplementation(() => {});

    const ctx: any = {
      switchToHttp: () => ({
        getRequest: () => ({
          requestId: 'rid-1',
          method: 'GET',
          originalUrl: '/api/addresses/x',
        }),
        getResponse: () => ({ statusCode: 200 }),
      }),
    };

    const next: any = { handle: () => of({ ok: true }) };

    await lastValueFrom(interceptor.intercept(ctx, next));
    await new Promise<void>((r) => setImmediate(r));
    expect(logSpy).toHaveBeenCalledTimes(1);
    const parsed = JSON.parse(String(logSpy.mock.calls[0][0]));
    expect(parsed).toEqual(
      expect.objectContaining({
        service: 'address-service-test',
        requestId: 'rid-1',
        method: 'GET',
        path: '/api/addresses/x',
        statusCode: 200,
      }),
    );
    expect(typeof parsed.durationMs).toBe('number');

    logSpy.mockRestore();
  });
});
