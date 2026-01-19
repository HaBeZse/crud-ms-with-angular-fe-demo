import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request & any>();
    const header = (req.headers?.authorization ||
      req.headers?.Authorization) as string | undefined;

    if (!header || !header.startsWith('Basic ')) {
      throw new UnauthorizedException('Missing or invalid Auth');
    }

    const base64 = header.slice('Basic '.length).trim();
    let decoded = '';
    try {
      decoded = Buffer.from(base64, 'base64').toString('utf8');
    } catch {
      throw new UnauthorizedException('Missing or invalid Auth');
    }

    const sep = decoded.indexOf(':');
    if (sep < 0) throw new UnauthorizedException('Missing or invalid Auth');

    const user = decoded.slice(0, sep);
    const pass = decoded.slice(sep + 1);

    const expectedUser = this.config.get<string>('BASIC_AUTH_USER', 'admin');
    const expectedPass = this.config.get<string>('BASIC_AUTH_PASS', 'admin');

    if (user !== expectedUser || pass !== expectedPass) {
      throw new UnauthorizedException('Missing or invalid Auth');
    }

    return true;
  }
}
