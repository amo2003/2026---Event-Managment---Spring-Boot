const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[A-Za-z\s.'-]{2,60}$/;
const phoneRegex = /^\+?[0-9]{10,15}$/; // eslint-disable-line no-unused-vars
const trackingCodeRegex = /^RISK-\d{4}-[A-Z0-9]{6}$/; // eslint-disable-line no-unused-vars
const imageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
const maxImageSize = 5 * 1024 * 1024;

export const validateLoginForm = (values) => {
  const errors = {};

  if (!values.email?.trim()) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(values.email.trim())) {
    errors.email = "Enter a valid email address";
  }

  if (!values.password?.trim()) {
    errors.password = "Password is required";
  } else if (values.password.trim().length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};

export const validateOfficerRegisterForm = (values) => {
  const errors = {};

  if (!values.fullName?.trim()) {
    errors.fullName = "Full name is required";
  } else if (!nameRegex.test(values.fullName.trim())) {
    errors.fullName = "Name should contain only letters and basic punctuation";
  }

  if (!values.email?.trim()) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(values.email.trim())) {
    errors.email = "Enter a valid email address";
  }

  if (!values.password?.trim()) {
    errors.password = "Password is required";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  } else if (!/[A-Z]/.test(values.password)) {
    errors.password = "Password must include at least one uppercase letter";
  } else if (!/[a-z]/.test(values.password)) {
    errors.password = "Password must include at least one lowercase letter";
  } else if (!/[0-9]/.test(values.password)) {
    errors.password = "Password must include at least one number";
  }

  if (!values.confirmPassword?.trim()) {
    errors.confirmPassword = "Confirm password is required";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (!values.phoneNumber?.trim()) {
    errors.phoneNumber = "Phone number is required";
  } else if (!/^\+?[\d\s-]{7,20}$/.test(values.phoneNumber.trim())) {
    errors.phoneNumber = "Enter a valid phone number";
  }

  if (!values.role?.trim()) {
    errors.role = "Officer role is required";
  }

  return errors;
};

export const validateReportIncidentForm = (values, file) => {
  const errors = {};

  if (!values.incidentType?.trim()) {
    errors.incidentType = "Incident type is required";
  }

  if (values.priority && !["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(values.priority)) {
    errors.priority = "Select a valid priority";
  }

  if (!values.reportedBy?.trim()) {
    errors.reportedBy = "Reporter name is required";
  } else if (!nameRegex.test(values.reportedBy.trim())) {
    errors.reportedBy = "Reporter name looks invalid";
  }

  if (!values.placeAreaId) {
    errors.placeAreaId = "Place area is required";
  }

  if (!values.exactLocation?.trim()) {
    errors.exactLocation = "Exact location is required";
  } else if (values.exactLocation.trim().length < 4) {
    errors.exactLocation = "Location must be at least 4 characters";
  } else if (values.exactLocation.trim().length > 120) {
    errors.exactLocation = "Location must be under 120 characters";
  }

  if (!values.description?.trim()) {
    errors.description = "Description is required";
  } else if (values.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters";
  } else if (values.description.trim().length > 500) {
    errors.description = "Description must be under 500 characters";
  }

  if (file) {
    if (!imageTypes.includes(file.type)) {
      errors.file = "Only JPG, PNG, or WEBP images are allowed";
    } else if (file.size > maxImageSize) {
      errors.file = "Image size must be below 5MB";
    }
  }

  return errors;
};

export const validateTrackIncidentForm = (trackingCode) => {
  const errors = {};

  if (!trackingCode?.trim()) {
    errors.trackingCode = "Tracking code is required";
  }

  return errors;
};

export const validateChangePasswordForm = (values) => {
  const errors = {};

  if (!values.currentPassword?.trim()) {
    errors.currentPassword = "Current password is required";
  }

  if (!values.newPassword?.trim()) {
    errors.newPassword = "New password is required";
  } else if (values.newPassword.length < 8) {
    errors.newPassword = "New password must be at least 8 characters";
  } else if (!/[A-Z]/.test(values.newPassword)) {
    errors.newPassword = "New password must include an uppercase letter";
  } else if (!/[a-z]/.test(values.newPassword)) {
    errors.newPassword = "New password must include a lowercase letter";
  } else if (!/[0-9]/.test(values.newPassword)) {
    errors.newPassword = "New password must include a number";
  }

  if (!values.confirmPassword?.trim()) {
    errors.confirmPassword = "Confirm password is required";
  } else if (values.newPassword !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (
    values.currentPassword &&
    values.newPassword &&
    values.currentPassword === values.newPassword
  ) {
    errors.newPassword = "New password must be different from current password";
  }

  return errors;
};

export const validateEvidenceFile = (file) => {
  const errors = {};

  if (!file) {
    errors.file = "Please choose an evidence image";
  } else if (!imageTypes.includes(file.type)) {
    errors.file = "Only JPG, PNG, or WEBP images are allowed";
  } else if (file.size > maxImageSize) {
    errors.file = "Image size must be below 5MB";
  }

  return errors;
};

export const validateResolutionReportForm = (values) => {
  const errors = {};

  if (!values.summary?.trim()) {
    errors.summary = "Summary is required";
  } else if (values.summary.trim().length < 10) {
    errors.summary = "Summary must be at least 10 characters";
  }

  if (!values.actionTaken?.trim()) {
    errors.actionTaken = "Action taken is required";
  } else if (values.actionTaken.trim().length < 10) {
    errors.actionTaken = "Action taken must be at least 10 characters";
  }

  if (!values.preparedBy?.trim()) {
    errors.preparedBy = "Prepared by is required";
  } else if (!nameRegex.test(values.preparedBy.trim())) {
    errors.preparedBy = "Prepared by name looks invalid";
  }

  return errors;
};

export const validateForgotPasswordForm = (values) => {
  const errors = {};

  if (!values.email?.trim()) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(values.email.trim())) {
    errors.email = "Enter a valid email address";
  }

  return errors;
};

export const validateResetPasswordForm = (values) => {
  const errors = {};

  if (!values.email?.trim()) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(values.email.trim())) {
    errors.email = "Enter a valid email address";
  }

  if (!values.resetCode?.trim()) {
    errors.resetCode = "Reset code is required";
  } else if (!/^\d{6}$/.test(values.resetCode.trim())) {
    errors.resetCode = "Reset code must be a 6-digit code";
  }

  if (!values.newPassword?.trim()) {
    errors.newPassword = "New password is required";
  } else if (values.newPassword.length < 8) {
    errors.newPassword = "New password must be at least 8 characters";
  } else if (!/[A-Z]/.test(values.newPassword)) {
    errors.newPassword = "New password must include an uppercase letter";
  } else if (!/[a-z]/.test(values.newPassword)) {
    errors.newPassword = "New password must include a lowercase letter";
  } else if (!/[0-9]/.test(values.newPassword)) {
    errors.newPassword = "New password must include a number";
  }

  if (!values.confirmPassword?.trim()) {
    errors.confirmPassword = "Confirm password is required";
  } else if (values.newPassword !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};