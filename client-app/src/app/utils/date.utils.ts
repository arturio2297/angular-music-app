const toInputDate = (value: Date | string): DateString => {
  const date: Date | string = typeof value === 'string' ? new Date(value) : value;
  return date.toISOString().substring(0, 10);
}

const prettyTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time - minutes * 60)
  return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`
}

const DateUtils = {
  toInputDate,
  prettyTime
}

export default DateUtils;
