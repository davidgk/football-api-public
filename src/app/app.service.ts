import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  greetings(): string {
    return 'Hi there , thanks for starting Football-api, created by David G. Kotlirevsky';
  }
}
