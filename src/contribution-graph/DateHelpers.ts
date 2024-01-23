// returns a new date shifted a certain number of days (can be negative)
export function shiftDate(date: Date, numDays: number) {
  const newDate = new Date(date).setUTCHours(0, 0, 0, 0) + numDays * 86400000;
  return new Date(newDate);
}

export function getBeginningTimeForDate(date: Date) {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

// obj can be a parseable string, a millisecond timestamp, or a Date object
export function convertToDate(obj: string | number | Date) {
  return obj instanceof Date ? obj : new Date(obj);
}
