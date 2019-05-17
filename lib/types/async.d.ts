//@ts-check
/// <reference path="./global.d.ts" />
/// <reference lib="esnext.asynciterable" />

export type resolved<T> = T extends Promise<infer U> ? U : T;
export type unresolved<T> = T extends Promise<infer U> ? T : U;
export type resolvable<T> = resolved<T> | unresolved<T>;

export type iterable<T> = AbstractIterator<T> | Iterable<T> | AsyncIterable<T>;
export type iterates<T> = AbstractIterator<T>;
export type generator<T> = Generator<T> | AsyncGenerator<T>;

/// IteratorResult
export interface AbstractResult<T, U extends boolean = boolean> {
	value?: T | undefined;
	done?: U;
}

/// Iterator
export interface AbstractIterator<V> {
	next<U>(received?: U): resolvable<AbstractResult<V | U>>;
	throw?<E>(error?: E): resolvable<AbstractResult<V>>;
	return?<U>(received?: U): resolvable<AbstractResult<V | U>, true>;
}

export interface Iterator<V> extends AbstractIterator<V> {
	next<U>(received?: U): resolved<AbstractResult<V | U>>;
	throw<E>(error?: E): resolved<AbstractResult<V>>;
	return<U>(received?: U): resolved<AbstractResult<V | U, true>>;
}

export interface AsyncIterator<V> extends AbstractIterator<V> {
	next<U>(received?: U): unresolved<AbstractResult<V | U>>;
	throw<E>(error?: E): unresolved<AbstractResult<V>>;
	return<U>(received?: U): unresolved<AbstractResult<V | U, true>>;
}

/// Iterable

export interface Iterable<V> {
	[Symbol.iterator](): this extends Iterator<V> ? this : Iterator<V>;
}

export interface AsyncIterable<T> {
	[Symbol.asyncIterator](): this extends AsyncIterator<T> ? this : AsyncIterator<T>;
}

/// IterableIterator

export interface IterableIterator<V> extends Iterator<V>, Iterable<V> {
	[Symbol.iterator](): this;
}

export interface AsyncIterableIterator<T> extends AsyncIterator<T>, AsyncIterable<T> {
	[Symbol.asyncIterator](): this;
}
/// IterableIterator

export interface Generator<V> extends Function {
	(...args: any): IterableIterator;
}

export interface AsyncGenerator<V> extends Function {
	(...args: any): AsyncIterableIterator;
}
