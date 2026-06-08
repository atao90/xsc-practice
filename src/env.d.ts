/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ZHIPU_API_KEY?: string
  readonly VITE_ZHIPU_API_URL?: string
  readonly VITE_ZHIPU_MODEL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'sql.js' {
  const initSqlJs: any
  export default initSqlJs
  export interface Database {
    run(sql: string, params?: any[]): void
    exec(sql: string): any[]
    prepare(sql: string): Statement
    export(): Uint8Array
    close(): void
  }
  export interface Statement {
    bind(params: any[]): boolean
    step(): boolean
    getAsObject(): any
    free(): boolean
    run(params?: any[]): void
  }
}
