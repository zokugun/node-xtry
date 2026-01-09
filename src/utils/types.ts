export type NotPromise<T> = Exclude<T, Promise<unknown>>;
export type NonPromiseCallback<T, Args extends unknown[] = []> = (...args: Args) => NotPromise<T>;
export type PromiseCallback<T, Args extends unknown[] = []> = ((...args: Args) => Promise<T>) | Promise<T>;
export type Callback<T, Args extends unknown[] = []> = NonPromiseCallback<T, Args> | PromiseCallback<T, Args>;
export type MaybePromise<T> = T | Promise<T>;
