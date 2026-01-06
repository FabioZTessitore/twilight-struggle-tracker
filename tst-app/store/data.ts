import { create } from 'zustand';

import regions from './regions_data.json';

export const useData = create((set) => ({
  //   isLoading: false,
  //   setIsLoading: (isLoading: boolean) => set({ isLoading }),
  regions: regions,
}));
