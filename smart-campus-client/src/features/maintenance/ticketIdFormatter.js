/**
 * Unified helper to format Ticket IDs.
 * Uses the last 4 characters of the raw ID, prefixed with "TKT-".
 */
const getStandardizedId = (rawId) => {
  if (!rawId) return 'N/A';
  const idString = String(rawId);
  
  // Avoid double-prefixing if the ID is already formatted
  if (idString.startsWith('TKT-')) return idString.toUpperCase();
  
  // Take the last 4 characters (works for both long hex IDs and short sequence numbers)
  const shortCode = idString.slice(-4).toUpperCase();
  return `TKT-${shortCode}`;
};

/**
 * Formats a raw ticket ID for display to technicians and administrators.
 */
export const formatTicketIdForTechnicianAdmin = (rawTicketId) => getStandardizedId(rawTicketId);

/**
 * Returns the same formatted ticket ID for display to normal users.
 * @param {string} rawTicketId The full, raw ticket ID.
 * @returns {string} The standardized ticket ID.
 */
export const formatTicketIdForUser = (rawTicketId) => getStandardizedId(rawTicketId);

// Alias for general use
export const formatTicketId = (rawTicketId) => getStandardizedId(rawTicketId);