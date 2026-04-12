/**
 * Get today's date in YYYY-MM format
 */
export const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Check if date string is valid and not in future
 * Format: YYYY-MM
 */
export const isValidPastDate = (dateString) => {
  if (!dateString) return true; // Empty is ok for optional fields
  const today = getTodayDateString();
  return dateString <= today;
};

/**
 * Check if end date is >= start date
 * Format: YYYY-MM
 */
export const isValidDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return true; // If either is empty, skip check
  return endDate >= startDate;
};
