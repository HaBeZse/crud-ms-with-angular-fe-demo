import { randomUUID } from 'crypto';
import type { Request, Response, NextFunction } from 'express';

export const REQUEST_ID_HEADER = 'x-request-id';

export function requestIdMiddleware(
  req: Request & { requestId?: string },
  res: Response,
  next: NextFunction,
) {
  const incoming =
    (req.headers[REQUEST_ID_HEADER] as string | undefined) ??
    (req.headers[REQUEST_ID_HEADER.toLowerCase()] as string | undefined);

  const requestId = (incoming && incoming.trim()) || randomUUID();

  req.requestId = requestId;
  res.setHeader(REQUEST_ID_HEADER, requestId);

  next();
}
