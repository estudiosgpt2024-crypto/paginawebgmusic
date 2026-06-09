export function addCalendarMonths(from: Date, months: number): Date {
  const targetDay = from.getDate();
  const result = new Date(
    from.getFullYear(),
    from.getMonth() + months,
    1,
    from.getHours(),
    from.getMinutes(),
    from.getSeconds(),
    from.getMilliseconds()
  );

  const lastDayOfTargetMonth = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0
  ).getDate();

  result.setDate(Math.min(targetDay, lastDayOfTargetMonth));
  return result;
}
