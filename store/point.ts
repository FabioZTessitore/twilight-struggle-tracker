import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TPointStore } from './types';
import { useTrackerStore } from './tracker';

export interface TPointState {
  actualPoints: number;

  pointsModal: boolean;
}

export interface TPointMutations {
  setActualPoints: (actualPoints: number) => void;

  setPointsModal: (open: boolean) => void;
}

export interface TPointAction {}

const pointState = {
  actualPoints: 0,
  // potentialPoints:0

  pointsModal: false,
} satisfies TPointState;

const pointMutations = {
  setActualPoints: (actualPoints) => usePointStore.setState({ actualPoints }),

  setPointsModal: (pointsModal) => usePointStore.setState({ pointsModal }),
} satisfies TPointMutations;

const pointAction = {
  calculatePoints: () => {
    const {} = useTrackerStore.getState();
  },
} satisfies TPointAction;

export const usePointStore = create<TPointStore>()(
  persist(
    () =>
      <TPointStore>{
        ...pointState,
        ...pointMutations,
        ...pointAction,
      },
    {
      name: 'pointStore',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({}),
    }
  )
);
