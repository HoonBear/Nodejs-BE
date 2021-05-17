export function plusUnitTimestampOnDays(time: number, days: number): number {
  const tempTime = 86400 * days;
  return time + tempTime;
}

export const calculateDaysRemaining = (from: number, to: number): number => {
  if (from > to || !from || !to) {
    return 0;
  } else {
    return Math.floor((to - from) / 86400) + 1;
  }
};
