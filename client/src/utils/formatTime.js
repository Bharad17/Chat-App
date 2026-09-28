/**
 * Formats a date value into a human-readable time string.
 * @param {string | Date} date
 * @returns {string} e.g. "09:41 AM"
 */
export function formatTime(date) {
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formats a date into a date + time string for accessibility labels.
 * @param {string | Date} date
 * @returns {string} e.g. "Sep 28, 2026, 09:41 AM"
 */
export function formatFullDateTime(date) {
  return new Date(date).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
