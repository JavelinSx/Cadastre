// pinia-plugin-persistedstate.d.ts
import 'pinia';

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    /**
     * Опция для персистентного хранения состояния
     * Можно передать либо boolean, либо объект с дополнительными настройками.
     */
    persist?:
      | boolean
      | {
          enabled?: boolean;
          /**
           * Пути, которые необходимо сохранять.
           * Можно указывать как на верхнем уровне, так и в стратегии.
           */
          paths?: string[];
          strategies?: Array<{
            key?: string;
            storage?: Storage;
            paths?: string[];
          }>;
        };
  }
}
