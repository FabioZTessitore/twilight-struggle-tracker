import { TTrackerAction, TTrackerMutations, TTrackerState } from './tracker';
import { TPointAction, TPointMutations, TPointState } from './point';

export type RegionId = 'Europe' | 'Asia' | 'CA' | 'SA' | 'Africa' | 'ME';

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
  adjacentTo: 'USA' | 'URSS' | null;
  region: keyof Regions;
  subregion?: 'SEAsia';
  tempBattleground?: boolean;
}

export type Regions = Record<RegionId, Region>;

export type Countries = Country[];

export type TTrackerStore = TTrackerState & TTrackerMutations & TTrackerAction;

export type TPointStore = TPointAction & TPointMutations & TPointState;
