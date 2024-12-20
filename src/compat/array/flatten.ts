import { isArrayLike } from '../predicate/isArrayLike.ts';

/**
 * Flattens an array up to the specified depth.
 *
 * @template T - The type of elements within the array.
 * @template D - The depth to which the array should be flattened.
 * @param {ArrayLike<T> | null | undefined} value - The object to flatten.
 * @param {D} depth - The depth level specifying how deep a nested array structure should be flattened. Defaults to 1.
 * @returns {Array<FlatArray<T[], D>> | []} A new array that has been flattened.
 *
 * @example
 * const arr = flatten([1, [2, 3], [4, [5, 6]]], 1);
 * // Returns: [1, 2, 3, 4, [5, 6]]
 *
 * const arr = flatten([1, [2, 3], [4, [5, 6]]], 2);
 * // Returns: [1, 2, 3, 4, 5, 6]
 */
export function flatten<T, D extends number = 1>(
  value: ArrayLike<T> | null | undefined,
  depth = 1 as D
): Array<FlatArray<T[], D>> | [] {
  const result: Array<FlatArray<T[], D>> = [];
  const flooredDepth = Math.floor(depth);

  if (!isArrayLike(value)) {
    return result;
  }

  const recursive = (arr: readonly T[], currentDepth: number) => {
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      if (
        currentDepth < flooredDepth &&
        (Array.isArray(item) ||
          Boolean(item?.[Symbol.isConcatSpreadable as keyof object]) ||
          (item !== null && typeof item === 'object' && Object.prototype.toString.call(item) === '[object Arguments]'))
      ) {
        if (Array.isArray(item)) {
          recursive(item, currentDepth + 1);
        } else {
          recursive(Array.from(item as T[]), currentDepth + 1);
        }
      } else {
        result.push(item as FlatArray<T[], D>);
      }
    }
  };

  recursive(Array.from(value), 0);

  return result;
}
