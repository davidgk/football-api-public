import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envConfigParam } from '@config/env-config-params';
import { FootballApiModule } from '@football-api/football-api.module';
import { CheckAccessFreemiumLib } from '@football-api/lib/check-access-freemium.lib';
import { API_FOOTBALL_V4 } from '@config/constants';
import { HttpException } from '@nestjs/common';

describe('CheckAccessFreemiumLib', function () {
  let configService: ConfigService;
  let moduleRef: TestingModule;
  let checkAccess: CheckAccessFreemiumLib;
  const now = new Date().getTime();
  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(envConfigParam), FootballApiModule],
    }).compile();
    checkAccess = moduleRef.get<CheckAccessFreemiumLib>(CheckAccessFreemiumLib);
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  describe('when I have payed subscription', function () {
    beforeEach(function () {
      jest.spyOn(configService, 'get').mockImplementation((param: string) => {
        if (param === API_FOOTBALL_V4.IS_PAYED) {
          return true;
        }
        if (param === API_FOOTBALL_V4.ACCESS_AMOUNT_FREE) {
          return 5;
        }
        if (param === API_FOOTBALL_V4.ACCESS_TIME_FREE) {
          return 10 * 60 * 1000;
        }
      });
      CheckAccessFreemiumLib.lastAccessList = [
        { accessDate: now - getMinutesInMillis(9) },
        { accessDate: now - getMinutesInMillis(7) },
        { accessDate: now - getMinutesInMillis(2) },
        { accessDate: now - getMinutesInMillis(2) },
        { accessDate: now - getMinutesInMillis(2) },
        { accessDate: now - getMinutesInMillis(2) },
      ];
    });
    it('should allow nop matter the amount of access', function () {
      expect(checkAccess.checkIsAllowedToAccess()).toBeTruthy();
    });
  });
  describe('when I I have not payed subscription pass', function () {
    beforeEach(function () {
      jest.spyOn(configService, 'get').mockImplementation((param: string) => {
        if (param === API_FOOTBALL_V4.IS_PAYED) {
          return false;
        }
        if (param === API_FOOTBALL_V4.ACCESS_AMOUNT_FREE) {
          return 5;
        }
        if (param === API_FOOTBALL_V4.ACCESS_TIME_FREE) {
          return 10 * 60 * 1000;
        }
      });
    });
    it('should allow when there are less than allowed accesss', function () {
      CheckAccessFreemiumLib.lastAccessList = [
        { accessDate: now - getMinutesInMillis(9) },
        { accessDate: now - getMinutesInMillis(7) },
        { accessDate: now - getMinutesInMillis(2) },
      ];
      expect(checkAccess.checkIsAllowedToAccess()).toBeTruthy();
      expect(CheckAccessFreemiumLib.lastAccessList.length).toBe(4);
    });
    it('should allow when there are equal than allowed access but allowed', function () {
      CheckAccessFreemiumLib.lastAccessList = [
        { accessDate: now - getMinutesInMillis(31) },
        { accessDate: now - getMinutesInMillis(11) },
        { accessDate: now - getMinutesInMillis(9) },
        { accessDate: now - getMinutesInMillis(7) },
        { accessDate: now - getMinutesInMillis(2) },
      ];
      expect(checkAccess.checkIsAllowedToAccess()).toBeTruthy();
      expect(CheckAccessFreemiumLib.lastAccessList.length).toBe(5);
    });
    it('should allow when there are equal than allowed and not allowed should throw an error', function () {
      CheckAccessFreemiumLib.lastAccessList = [
        { accessDate: now - getMinutesInMillis(9) },
        { accessDate: now - getMinutesInMillis(8) },
        { accessDate: now - getMinutesInMillis(4) },
        { accessDate: now - getMinutesInMillis(7) },
        { accessDate: now - getMinutesInMillis(2) },
      ];
      expect(() => checkAccess.checkIsAllowedToAccess()).toThrow(HttpException);
      expect(CheckAccessFreemiumLib.lastAccessList.length).toBe(5);
    });
  });
});

function getMinutesInMillis(min: number) {
  return min * 60 * 1000;
}
