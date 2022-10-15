const parse = <T extends {} | string>(value: string): T => {
  try {
    return JSON.parse(value);
  } catch (err) {
    console.debug(value, 'is not a json object');
  }
  return value as T;
}

export type StringifyValue<T extends {}> = string | number | symbol | T;

const stringify = <T extends {}>(value: StringifyValue<T>): string => {
  return typeof value === 'object' ? JSON.stringify(value) : value as string;
}

const JsonUtils = {
  parse,
  stringify
}

export default JsonUtils;
