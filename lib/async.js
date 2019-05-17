//@ts-check
export const awaitAll = async (...values) => void (await Promise.all(values.flat()));

export const resolvedPromise = Promise.resolve();

/**
 * @template T, U
 * @param {iterable<T>} iterable
 * @param {(value: T) => U | Promise<U>} ƒ
 * @param {U | T} [value]
 */
export async function each(iterable, ƒ, value) {
  /** @type {iterates<T>} */
  const iterator =
    (iterable && ('next' in iterable && typeof iterable.next === 'function' && iterable)) ||
    ((Symbol.asyncIterator in iterable && iterable[Symbol.asyncIterator]()) ||
      (Symbol.iterator in iterable && iterable[Symbol.iterator]()));
  try {
    let result, done;
    let received = arguments.length > 2;
    let value = arguments[2];
    while (!done && (result = received ? iterator.next(value) : iterator.next())) {
      ({done, value} = typeof result.then !== 'function' ? await result : result);
      received =
        undefined !==
        ((value = ƒ(
          value && 'then' in value && typeof value.then === 'function' ? await value : value,
        )) &&
        'then' in value &&
        typeof value.then === 'function'
          ? (value = await value)
          : value);
    }
  } finally {
    iterator &&
      iterable !== iterator &&
      'return' in iterator &&
      typeof iterator.return === 'function' &&
      iterator.return();
  }
}

/**
 * @template T
 * @typedef {import('./types/async').iterable<T>} iterable<T>
 */

/**
 * @template T
 * @typedef {import('./types/async').iterates<T>} iterates<T>
 */
