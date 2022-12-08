import { Team } from '@teams/models/entities/team.entity';
import {
  CoachInterface,
  PlayerInterface,
} from '@players/models/interfaces/player.interfaces';

export interface TeamExpectedInterface {
  name: string;
  area: { name: string };
  address: string;
  shortName: string;
  tla: string;
  coach?: CoachInterface;
  squad?: PlayerInterface[];
}

export interface SaveSQuadParamsInterface {
  team: Team;
  squad?: PlayerInterface[];
  coach?: CoachInterface;
}
