const getFirst = <T>(arr: T[]): T => {
  return arr[0];
}

const getLast = <T>(arr: T[]): T => {
  return arr[arr.length - 1];
}

const getNext = <T>(el: T, arr: T[]): T => {
  const index = arr.findIndex(x => x === el);
  return arr[index + 1];
}

const getPrevious = <T>(el: T, arr: T[]): T => {
  const index = arr.findIndex(x => x === el);
  return arr[index - 1];
}

const create = (count: number, shift = 0): number[] => {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr[i] = i + shift;
  }
  return arr;
}

const ArrayUtils = {
  getFirst,
  getLast,
  getNext,
  getPrevious,
  create
}

export default ArrayUtils;
