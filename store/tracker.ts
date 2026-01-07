import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { regions } from '~/store/regions_data';
import { countries } from '~/store/countries_data';
import { Countries, Regions, TTrackeStore } from './types';

export interface TTrackeState {
  regions: Regions;

  countries: Countries;
}

export interface TTrackeMutations {}

export interface TTrackeAction {}

const trackerState = {
  regions: regions,

  countries: countries as Countries,
} satisfies TTrackeState;

const trackerMutations = {} satisfies TTrackeMutations;

const trackerAction = {} satisfies TTrackeAction;

export const useTrackerStore = create<TTrackeStore>()(
  persist(
    () =>
      <TTrackeStore>{
        ...trackerState,
        ...trackerMutations,
        ...trackerAction,
      },
    {
      name: 'trackerStore',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({}),
    }
  )
);
