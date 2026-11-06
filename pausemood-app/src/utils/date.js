/**
 * date.js – shared date formatting helpers.
 * Keeps formatting logic in one place so it's easy to change.
 */

/**
 * formatDateTime(isoString)
 * Returns a human-readable date+time string like "6 Nov, 6:42 PM".
 *
 * @param {string} isoString – ISO 8601 date string
 * @returns {string}
 */
export function formatDateTime(isoString) {
  const date = new Date(isoString);
  const day = date.getDate();
  const month = date.toLocaleString('en-GB', { month: 'short' }); // "Nov"
  const time = date.toLocaleString('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).toUpperCase(); // "6:42 PM"

  return `${day} ${month}, ${time}`;
}

/**
 * getDayInitial(date)
 * Returns the weekday initial for the 7-day strip, e.g. "M", "T", "W".
 *
 * @param {Date} date
 * @returns {string}
 */
export function getDayInitial(date) {
  return date.toLocaleString('en-GB', { weekday: 'short' }).charAt(0);
}

/**
 * getDayAbbrev(date)
 * Returns the 3-letter weekday abbreviation, e.g. "Mon", "Tue", "Wed".
 */
export function getDayAbbrev(date) {
  return date.toLocaleString('en-GB', { weekday: 'short' });
}


/**
 * getLast7Days()
 * Returns an array of 7 Date objects, oldest first, ending with today.
 *
 * @returns {Date[]}
 */
export function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    days.push(d);
  }
  return days;
}

/**
 * isSameDay(a, b)
 * Returns true if two Date objects fall on the same calendar day.
 */
export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

