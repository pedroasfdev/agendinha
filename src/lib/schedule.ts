export const minutes = (time: string) => {
  const [hours, mins] = time.split(':').map(Number);
  return hours * 60 + mins;
};
export const durationMinutes = (duration: string) => {
  const hours = duration.match(/(\d+)h/);
  const mins = duration.match(/h(\d+)/) ?? duration.match(/(\d+)\s*min/);
  return (hours ? Number(hours[1]) * 60 : 0) + (mins ? Number(mins[1]) : 0);
};
export const endTime = (start: string, duration: string) => {
  const total = minutes(start) + durationMinutes(duration);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};
export const overlaps = (start: string, end: string, otherStart: string, otherEnd: string) =>
  minutes(start) < minutes(otherEnd) && minutes(end) > minutes(otherStart);
export const weekDates = (start: string, offset: number, count = 7) =>
  Array.from({ length: count }, (_, index) => {
    const date = new Date(`${start}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() + offset + index);
    return date.toISOString().slice(0, 10);
  });
export const weekday = (date: string) => new Date(`${date}T12:00:00Z`).getUTCDay();
export const weekLabels = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
