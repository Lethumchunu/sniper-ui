export const sessionWindows = [
  { label: 'London Open', start: '07:00', end: '09:00' },
  { label: 'New York Open', start: '12:00', end: '14:00' }
];

export function isInSession(date: Date): boolean {
  const currentUTC = date.toISOString().slice(11, 16); // HH:mm in UTC

  return sessionWindows.some(({ start, end }) => {
    return currentUTC >= start && currentUTC <= end;
  });
}
