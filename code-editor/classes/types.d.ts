// @ts-check

declare interface Properties {
  [name: string]: any;
}

declare type Options<T> = Partial<T> & Partial<Properties>;

// declare namespace Options {}
declare type source = import('./source').Source;
