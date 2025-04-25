
/**
 * Format a phone number as (XX) XXXXX-XXXX as the user types
 */
export function formatPhoneNumber(value: string): string {
  // Remove all non-digit characters
  const phone = value.replace(/\D/g, '');
  
  // Apply formatting based on length
  if (phone.length <= 2) {
    return phone;
  } else if (phone.length <= 7) {
    return `(${phone.slice(0, 2)}) ${phone.slice(2)}`;
  } else if (phone.length <= 11) {
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
  }
  
  // Limit to 11 digits (Brazilian format)
  return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7, 11)}`;
}
