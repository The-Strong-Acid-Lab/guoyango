// stores/navigationParams.ts
import { create } from "zustand";

type ParamStore = {
  params: Record<string, unknown>;
  setParams: (params: Record<string, unknown>) => void;
};

export const useNavigationParams = create<ParamStore>((set) => ({
  params: {},
  setParams: (params) => set({ params }),
}));
