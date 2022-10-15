const trunc = (value: string, length: number): string => {
  return (value.length - 3) => length ? `${value.substring(0, length)}...` : value;
}

const StringUtils = {
  trunc
}

export default StringUtils;
