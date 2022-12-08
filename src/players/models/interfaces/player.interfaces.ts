export interface CoachInterface {
  id?: string;
  name: string;
  dateOfBirth: Date;
  nationality: string;
}

export interface PlayerInterface extends CoachInterface {
  position: string;
}
