namespace Utils {
  export function mergeClassnames(
    ...classnames: (string | undefined | boolean)[]
  ) {
    return classnames.filter((c) => typeof c == "string").join(" ");
  }

  export function numberArray(start: number, count: number, step: number = 1) {
    return Array(count)
      .fill(true)
      .map((_, index) => start + index * step);
  }

  export function mergeSets<T extends any>(...sets: Set<T>[]): Set<T> {
    return sets.reduce(
      (commonSet, set) => (set.forEach((el) => commonSet.add(el)), commonSet),
      new Set()
    );
  }

  /**
   * Add members of setB into setA
   * returns setA
   */
  export function addSet<A extends any, B extends any>(
    setA: Set<A>,
    setB: Set<B>
  ): Set<A | B> {
    setB.forEach((el) => setA.add(el as any));
    return setA;
  }

  export function randomSet<T extends any>(elements: T[]) {
    const elementCount = Phaser.Math.RND.integerInRange(0, elements.length - 1);
    const set: Set<T> = new Set();

    while (set.size !== elementCount)
      set.add(Phaser.Utils.Array.GetRandom(elements));
    return set;
  }

  export function diffSet<T extends any>(setA: Set<T>, setB: Set<any>): Set<T> {
    const set = new Set(setA.values());
    setB.forEach((el) => set.delete(el));
    return set;
  }

  export function toggleItemInSet<T extends any>(set: Set<T>, item: T): Set<T> {
    if (set.has(item)) set.delete(item);
    else set.add(item);
    return set;
  }

  export function count<T extends any>(
    arr: T[],
    callback: (element: T, index: number) => boolean = (e) => !!e
  ): number {
    let amount = 0;
    for (let i = arr.length; i >= 0; i--) if (callback(arr[i], i)) amount++;
    return amount;
  }
}

export default Utils;
