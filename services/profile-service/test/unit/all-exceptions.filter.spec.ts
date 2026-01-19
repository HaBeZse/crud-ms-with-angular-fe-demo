import { BadRequestException } from '@nestjs/common';
import { AllExceptionsFilter } from '../../src/common/filters/all-exceptions.filter';

describe('AllExceptionsFilter (profile)', () => {
  it('catch() -> formats HttpException into ErrorResponseDto shape', () => {
    const filter = new AllExceptionsFilter('test-service');

    const errSpy = jest
      .spyOn((filter as any).logger, 'error')
      .mockImplementation(() => {});

    const req: any = {
      url: '/api/students',
      originalUrl: '/api/students',
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

    filter.catch(new BadRequestException(['x']), host);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        error: 'Bad Request',
        path: '/api/students',
        requestId: 'rid-123',
        message: expect.anything(),
        timestamp: expect.any(String),
      }),
    );
    expect(errSpy).toHaveBeenCalledTimes(1);
  });
});
