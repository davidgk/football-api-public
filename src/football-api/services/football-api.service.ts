import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { API_FOOTBALL_V4 } from '@config/constants';
import { ConfigService } from '@nestjs/config';
import { CheckAccessFreemiumLib } from '@football-api/lib/check-access-freemium.lib';

@Injectable()
export class FootballApiService {
  mainUrl: string;
  axiosOptions = {
    headers: {
      ['X-Auth-Token']: this.configService.get(API_FOOTBALL_V4.TOKEN),
      ['Accept-Encoding']: '',
      ['Content-Type']: 'application/json',
    },
    decompress: true,
  };

  constructor(
    private configService: ConfigService,
    private checkAccess: CheckAccessFreemiumLib,
  ) {
    this.mainUrl = this.configService.get(API_FOOTBALL_V4.URL);
  }

  async getLeagueByCode(code: string) {
    this.checkAccess.checkIsAllowedToAccess();
    const url = `${this.mainUrl}/competitions/${code}`;
    return axios.get(url, this.axiosOptions);
  }

  async getTeamsByCompetitionCode(code: string) {
    this.checkAccess.checkIsAllowedToAccess();
    const url = `${this.mainUrl}/competitions/${code}/teams`;
    return axios.get(url, this.axiosOptions);
  }
}
