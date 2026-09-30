/**
 * Capitalizes the first letter of a string
 * @param str - The input string
 * @returns String with first letter in uppercase
 */
export const capitalizeFirstLetter = (str: string) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
