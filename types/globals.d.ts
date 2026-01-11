import '@total-typescript/ts-reset';

declare global {
  /**
   * uuid v4
   */
  type ID = string;
  /**
   * A really nice little type helper if you are trying to debug some
   * really complicated inheritance based inference.
   *
   * @see: https://www.youtube.com/watch?v=2lCCKiWGlC0&ab_channel=MattPocock
   */
  type Prettify<T> = {[K in keyof T]: T[K]} & {};

  /**
   * A type helper to declare not empty generic array.
   */
  type NonEmptyArray<T> = [T, ...T[]];
}
