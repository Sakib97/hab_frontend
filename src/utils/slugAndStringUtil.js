export const deSlugify = (str) => {
  return str
    .split('-') // Split into words by hyphen
    .map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ) // Capitalize first letter of each word
    .join(' '); // Join with spaces
}

export const slugify = (str) => {
  // Convert the entire string to lowercase first
  let cleanedString = str.toLowerCase();

  // Replace all non-alphanumeric characters (except spaces) with a hyphen
  cleanedString = cleanedString.replace(/[^\w\s]/g, '-');

  // Replace any remaining spaces with hyphens
  cleanedString = cleanedString.replace(/\s+/g, '-');

  // Remove consecutive hyphens and trim leading/trailing hyphens
  cleanedString = cleanedString.replace(/-+/g, '-').replace(/^-|-$/g, '');

  return cleanedString;
}

export const stringToArray = (str) => {
  // Replace single quotes with double quotes to make it valid JSON
  const jsonFormattedStr = str.replace(/'/g, '"');

  // Parse the JSON string into an array
  try {
    return JSON.parse(jsonFormattedStr);
  } catch (error) {
    console.error("Failed to parse the string into an array:", error);
    return []; // Return empty array if parsing fails
  }
}

export const containsCharacter = (str) => {
  if (typeof str !== 'string') {
    // Handle non-string input if necessary
    return false;
  }
  // Check if the string contains any non-whitespace characters
  // /\S/s - searches for at least one non-whitespace character (\S)
  // if found, returns true
  // if not found, returns false
  return /\S/.test(str);
}