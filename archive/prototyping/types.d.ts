// @ts-check

declare namespace prototyping {
  interface namespace {
    // <T extends Partial<meta>>
    // prototyping?: T & meta;
    [name: string | symbol | number]: any;
  }

  interface record {
    id?;
    namespace?;
    url: record.url<string>;
    root: record.root<string>;
    query: record.query<string>;
    resolve: (specifier: string, referrer: string) => string;
  }

  namespace record {
    export type url<T = string> = identity<'prototyping.url', T & meta.url>;
    export type root<T = string> = identity<'prototyping.root', T>;
    export type query<T = string> = identity<'prototyping.query', T>;
  }

  interface meta extends ImportMeta {
    local: record;
    runtime: runtime;
    records?: {[name: string]: record};
  }

  namespace meta {
    interface url {
      split(separator: '?', limit: 2): [record['root'], record['query']];
    }
  }

  type identity<K extends string, T = string> = T & {
    [Symbol.species]?: K;
  };

  interface initialize {
    <T extends Partial<meta>>(instance: T): namespace<T>;
  }
}

// interface ImportMeta {}
