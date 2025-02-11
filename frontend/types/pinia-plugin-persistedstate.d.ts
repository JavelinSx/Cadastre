// frontend/types/pinia-plugin-persistedstate.d.ts
import 'pinia';

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    persist?:
      | boolean
      | {
          enabled?: boolean;
          paths?: string[];
          strategies?: Array<{
            key?: string;
            storage?: Storage;
            paths?: string[];
          }>;
        };
  }
}
