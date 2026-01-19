import { UnauthorizedException } from '@nestjs/common';
import { AllExceptionsFilter } from '../../src/common/filters/all-exceptions.filter';

describe('AllExceptionsFilter (address)', () => {
  it('catch() -> formats HttpException into ErrorResponseDto shape', () => {
    const filter = new AllExceptionsFilter('address-service-test');

    const errSpy = jest
      .spyOn((filter as any).logger, 'error')
      .mockImplementation(() => {});

    const req: any = {
      url: '/api/addresses/xxx',
      originalUrl: '/api/addresses/xxx',
      requestId: 'rid-123',
    };

    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res: any = { status };

    const host: any = {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
      }),
    };

    filter.catch(new UnauthorizedException('Missing or invalid Auth'), host);

    expect(status).toHaveBeenCalledWith(401);

    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        error: 'Unauthorized',
        path: '/api/addresses/xxx',
        requestId: 'rid-123',
        timestamp: expect.any(String),
        message: expect.anything(),
      }),
    );
    expect(errSpy).toHaveBeenCalledTimes(1);
  });
});
