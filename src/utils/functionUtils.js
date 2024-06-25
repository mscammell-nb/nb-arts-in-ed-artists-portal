export const formatAuthErrorMessage = (message) => {
  const removedAuthPrefix = message.substring("auth/".length);
  const removedDashes = removedAuthPrefix.replaceAll("-", " ");
  const capitalized =
    removedDashes.at(0).toUpperCase() + removedDashes.slice(1);

  return capitalized;
};

// Parses a phone number in this format: (123) 456-7890 -> 1234567890
export const parsePhoneNumber = (phoneNumber) => phoneNumber.replace(/\D/g, "");
