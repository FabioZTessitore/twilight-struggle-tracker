import { TTrackerAction, TTrackerMutations, TTrackerState } from './tracker';
import { TPointAction, TPointMutations, TPointState } from './point';

export type RegionId = 'Europe' | 'Asia' | 'CA' | 'SA' | 'Africa' | 'ME';

export enum Power {
  USA = 'USA',
  URSS = 'URSS',
}

export interface RegionStatus {
  presence: Power[];   // array per gestire entrambi
  domination: Power | null;
  control: Power | null;
}

export interface PowerStats {
  countries: number;
  battlegrounds: number;
  nonBattlegrounds: number;
}

export interface Region {
  name: string;
  points: {
    presence: number;
    domination: number;
    control: number;
  };
}

export interface Country {
  name: string;
  battleground: boolean;
  stability: number;
  blueInfluence: number;
  redInfluence: number;
  adjacentTo: Power | null;
  region: keyof Regions;
  subregion?: 'SEAsia';
  tempBattleground?: boolean;
  controlledBy: Power | undefined;
}

export type Regions = Record<RegionId, Region>;

export type Countries = Country[];

export type TTrackerStore = TTrackerState & TTrackerMutations & TTrackerAction;

export type TPointStore = TPointAction & TPointMutations & TPointState;
