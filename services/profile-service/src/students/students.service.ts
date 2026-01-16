import { Injectable } from '@nestjs/common';

@Injectable()
export class StudentsService {
  getHello(): string {
    return 'Hello World!';
  }
}
