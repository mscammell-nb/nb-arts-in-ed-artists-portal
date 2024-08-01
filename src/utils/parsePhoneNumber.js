// Parses a phone number in this format: (123) 456-7890 -> 1234567890
export const parsePhoneNumber = (phoneNumber) => phoneNumber.replace(/\D/g, "");