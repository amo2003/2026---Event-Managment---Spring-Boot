export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPhone = (phone) => {
  return /^(?:\+94|0)?[0-9]{9,10}$/.test(phone);
};

export const isStrongEnoughPassword = (password) => {
  return /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password);
};

export const isValidTrackingCode = (trackingCode) => {
  return /^RISK-\d{4}-[A-Z0-9]{6}$/.test(trackingCode.trim());
};

export const isValidImageFile = (file) => {
  if (!file) return true;

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSizeInBytes = 5 * 1024 * 1024;

  return allowedTypes.includes(file.type) && file.size <= maxSizeInBytes;
};