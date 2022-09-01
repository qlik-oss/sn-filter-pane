import { stardust } from '@nebula.js/stardust';
import create from 'zustand';
import createVanilla from 'zustand/vanilla';

export interface IStore {
  app?: EngineAPI.IApp | undefined;
  setApp?: (app: EngineAPI.IApp) => Function;
}

// export const useStore = create((set) => ({
//   app: undefined,
//   setApp: (app: EngineAPI.IApp) => set(() => ({ app })),
// }));

export const store = createVanilla(() => ({
  app: <EngineAPI.IApp | undefined>undefined,
  model: <EngineAPI.IGenericObject | undefined>undefined,
}));


