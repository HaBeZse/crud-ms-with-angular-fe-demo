import {
  requestIdMiddleware,
  REQUEST_ID_HEADER,
} from '../../src/common/middleware/request-id.middleware';

function mockRes() {
  const headers: Record<string, string> = {};
  return {
    setHeader: (k: string, v: string) => (headers[k.toLowerCase()] = v),
    _headers: headers,
  } as any;
}

describe('requestIdMiddleware (profile)', () => {
  it('middleware() -> generates requestId if missing and sets response header', () => {
    const req: any = { headers: {} };
    const res = mockRes();
    const next = jest.fn();

    requestIdMiddleware(req, res, next);

    expect(typeof req.requestId).toBe('string');
    expect(req.requestId).toHaveLength(36);
    expect(res._headers[REQUEST_ID_HEADER]).toBe(req.requestId);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('middleware() -> uses incoming x-request-id if provided', () => {
    const req: any = { headers: { 'x-request-id': 'demo-123' } };
    const res = mockRes();
    const next = jest.fn();

    requestIdMiddleware(req, res, next);

    expect(req.requestId).toBe('demo-123');
    expect(res._headers[REQUEST_ID_HEADER]).toBe('demo-123');
    expect(next).toHaveBeenCalledTimes(1);
  });
});
