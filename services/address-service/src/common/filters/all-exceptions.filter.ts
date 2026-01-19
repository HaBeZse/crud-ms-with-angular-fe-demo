import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly serviceName: string) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request & { requestId?: string }>();
    const res = ctx.getResponse<Response>();

    const path = (req as any).originalUrl ?? req.url;
    const timestamp = new Date().toISOString();
    const requestId = req.requestId;

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();

      const payload = exception.getResponse();
      if (typeof payload === 'string') {
        message = payload;
        error = exception.name;
      } else if (payload && typeof payload === 'object') {
        const p: any = payload;
        message = p.message ?? exception.message;
        error = p.error ?? exception.name;
      } else {
        message = exception.message;
        error = exception.name;
      }
    }

    const errLog = {
      ts: timestamp,
      level: 'error',
      service: this.serviceName,
      requestId,
      path,
      statusCode,
      message,
      error,
      stack: (exception as any)?.stack,
    };
    this.logger.error(JSON.stringify(errLog));

    res.status(statusCode).json({
      statusCode,
      message,
      error,
      path,
      timestamp,
      requestId,
    });
  }
}
