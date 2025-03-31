export const listFirebaseErrors = (errorMessage) => {
  const regex = /\[([^\]]+)\]/; // Matches everything inside the brackets []
  const match = errorMessage.match(regex);
  // If we successfully extract the requirements
  if (match && match[1]) {
    return match[1].split(",").map((requirement) => requirement.trim());
  }
  return null;
};
