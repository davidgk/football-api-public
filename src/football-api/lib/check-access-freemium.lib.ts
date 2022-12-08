import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { API_FOOTBALL_V4 } from '@config/constants';

export interface LastAccess {
  accessDate: number;
}
@Injectable()
export class CheckAccessFreemiumLib {
  static lastAccessList: LastAccess[] = [];
  constructor(private configService: ConfigService) {}

  checkIsAllowedToAccess() {
    const isPayed = this.configService.get(API_FOOTBALL_V4.IS_PAYED);
    if (!isPayed) {
      const lastAccesses = CheckAccessFreemiumLib.lastAccessList;
      const lastAccess = { accessDate: new Date().getTime() };
      const accessAmount = this.configService.get(
        API_FOOTBALL_V4.ACCESS_AMOUNT_FREE,
      );
      if (lastAccesses.length < accessAmount) {
        CheckAccessFreemiumLib.lastAccessList.push(lastAccess);
      } else {
        this.evaluateError(lastAccess, lastAccesses);
      }
    }
    return true;
  }

  private evaluateError(lastAccess: LastAccess, lastAccesses: LastAccess[]) {
    const diff = lastAccess.accessDate - lastAccesses[0].accessDate;
    this.increaseLastAccesses(lastAccess);
    const limitAmountTime = this.configService.get(
      API_FOOTBALL_V4.ACCESS_TIME_FREE,
    );
    if (diff < limitAmountTime) {
      const difference = Math.round((limitAmountTime - diff) / (1000 * 60));
      throw new HttpException(
        `You are exceeding time access, wait please ${difference} minute/s until next request`,
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }

  private increaseLastAccesses(lastAccess: { accessDate: number }) {
    CheckAccessFreemiumLib.lastAccessList.shift();
    CheckAccessFreemiumLib.lastAccessList.push(lastAccess);
  }
}
