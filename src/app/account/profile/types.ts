export type PasswordChangeForm = {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
};

export const passwordChangeFormObject: PasswordChangeForm = {
  currentPassword: "",
  newPassword: "",
  newPasswordConfirm: "",
};

export type PersonalDetailsForm = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
};

export const personalDetailsFormObject: PersonalDetailsForm = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  phoneNumber: "",
};
