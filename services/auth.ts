// This is a simple simulation of password hashing for demonstration purposes.
// In a real application, use a strong, salted hashing algorithm like bcrypt.
export const hashPassword = (password: string): string => {
  try {
    // A simple "hash": reverse the string and then base64 encode it.
    const reversed = password.split('').reverse().join('');
    return btoa(reversed);
  } catch (e) {
    console.error('Failed to hash password:', e);
    // Fallback for environments where btoa might not be available (unlikely in browser)
    return password;
  }
};

export const checkPassword = (password: string, hashedPassword: string): boolean => {
  return hashPassword(password) === hashedPassword;
};
