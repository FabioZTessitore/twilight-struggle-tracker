import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { regions } from '~/store/regions_data';
import { countries, countries as initialCountries } from '~/store/countries_data';

import { Regions, Countries, RegionId, RegionStatus, Power } from './types';

import {
  updateCountriesControl,
  computeAllRegionsStatus,
  computeRegionScore,
} from '~/lib/gameCalculations';

export interface TTrackerState {
  regions: Regions; // statiche (punti carta)
  countries: Countries;
  regionsStatus: Record<RegionId, RegionStatus>; // derivato
}

export interface TTrackerMutations {
  setCountries: (countries: Countries) => void;
  setRegionsStatus: (regionsStatus: Record<RegionId, RegionStatus>) => void;
}

export interface TTrackerAction {
  setInfluence: (countryName: string, side: 'blue' | 'red', value: number) => void;
  clearInfluences: () => void;
}

export type TTrackerStore = TTrackerState & TTrackerMutations & TTrackerAction;

// controllo iniziale dei paesi
const controlledCountries = updateCountriesControl(initialCountries as Countries);

const trackerState: TTrackerState = {
  regions,
  countries: controlledCountries,
  regionsStatus: computeAllRegionsStatus(regions, controlledCountries),
};

export const useTrackerStore = create<TTrackerStore>()(
  persist(
    (set) => ({
      ...trackerState,

      setCountries: (countries) => set({ countries }),

      setRegionsStatus: (regionsStatus) => set({ regionsStatus }),

      setInfluence: (countryName, side, value) => {
        set((state) => {
          // aggiorna influenza
          const updatedCountries = state.countries.map((c) =>
            c.name === countryName
              ? {
                  ...c,
                  blueInfluence: side === 'blue' ? value : c.blueInfluence,
                  redInfluence: side === 'red' ? value : c.redInfluence,
                }
              : c
          );

          // // ricalcola controllo paesi
          // const controlledCountries = updateCountriesControl(updatedCountries);

          // // ricalcola stato regioni
          // const regionsStatus = computeAllRegionsStatus(state.regions, controlledCountries);

          // salva il nuovo stato
          return {
            countries: updatedCountries,
            // regionsStatus,
          };
        });
      },

      clearInfluences: () => {
        useTrackerStore.setState((state) => {
          // azzera tutte le influenze
          const clearedCountries = state.countries.map((c) => ({
            ...c,
            blueInfluence: 0,
            redInfluence: 0,
            controlledBy: undefined,
          }));

          // azzero i controlledBy e regionStatus
          const controlledCountries = updateCountriesControl(clearedCountries);
          const regionsStatus = computeAllRegionsStatus(state.regions, controlledCountries);

          return {
            countries: controlledCountries,
            regionsStatus,
          };
        });
      },
    }),

    {
      name: 'trackerStore',
      storage: createJSONStorage(() => AsyncStorage),

      partialize: (state) => ({
        countries: state.countries,
      }),

      // Ricalcolo automatico dopo rehydrate
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const controlledCountries = updateCountriesControl(state.countries);
        state.countries = controlledCountries;
        state.regionsStatus = computeAllRegionsStatus(state.regions, controlledCountries);
      },
    }
  )
);
