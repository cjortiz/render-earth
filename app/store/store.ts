import { persist } from "zustand/middleware";
import create from "zustand";

type AssetLoadStateStore = {
  assetLoaded: boolean;
  setAssetLoaded: (data: boolean) => void;
};

type AssetLoadPercentStore = {
  percent: number;
  setPercent: (data: number) => void;
};

export const assetLoadPercentStore = create<AssetLoadPercentStore>()(
  persist(
    (set) => ({
      percent: 0, // JAVA BY DEFAULT
      setPercent: (stack: number) => set({ percent: stack }),
    }),
    {
      name: "asset-load-percent-storage", // unique name for storage
      getStorage: () => localStorage, // (optional) specify the storage type, localStorage is default
    }
  )
);

export const booleanStore = create<AssetLoadStateStore>()(
  persist(
    (set) => ({
      assetLoaded: false, // JAVA BY DEFAULT
      setAssetLoaded: (stack: boolean) => set({ assetLoaded: stack }),
    }),
    {
      name: "asset-load-state-storage", // unique name for storage
      getStorage: () => localStorage, // (optional) specify the storage type, localStorage is default
    }
  )
);
