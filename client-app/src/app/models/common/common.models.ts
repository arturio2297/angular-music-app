export type Action = () => void;
export const noOp = () => {};
export type Size<T extends string | number> = { width: T, height: T };
