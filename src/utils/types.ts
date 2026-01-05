export type NotPromise<T> = Exclude<T, Promise<unknown>>;
export type NonPromiseCallback<T> = () => NotPromise<T>;
export type PromiseCallback<T> = (() => Promise<T>) | Promise<T>;
export type Callback<T> = NonPromiseCallback<T> | PromiseCallback<T>;
export type MaybePromise<T> = T | Promise<T>;
