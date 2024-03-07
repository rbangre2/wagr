import React from "react";
import { Box, Typography } from "@mui/material";
import FormTextField from "@/components/FormTextField/FormTextField";
import { PasswordChangeForm } from "@/app/account/profile/types";
import styles from "./ChangePasswordCard.module.css";

interface ChangePasswordCardProps {
  passwordChangeForm: PasswordChangeForm;
  handlePasswordFormChange: (prop: string) => (event: {
    target: {
      value: any;
    };
  }) => void;
}

export default function ChangePasswordCard({
  passwordChangeForm,
  handlePasswordFormChange,
}: ChangePasswordCardProps) {
  return (
    <Box className={styles.container}>
      <Box className={styles.titleContainer}>
        <Typography className={styles.title}>Change Password</Typography>
        <Typography className={styles.subtitle}>
          Please enter your current password and your new password below. Press
          save once you&apos;re done!
        </Typography>
      </Box>
      <Box className={styles.passwordForm}>
        <FormTextField
          idName="currentPassword"
          labelName="Current Password"
          value={passwordChangeForm.currentPassword}
          onChange={handlePasswordFormChange("currentPassword")}
          type="password"
        />
        <FormTextField
          idName="newPassword"
          labelName="New Password"
          value={passwordChangeForm.newPassword}
          onChange={handlePasswordFormChange("newPassword")}
          type="password"
        />
        <FormTextField
          idName="newPasswordConfirm"
          labelName="Confirm New Password"
          value={passwordChangeForm.newPasswordConfirm}
          onChange={handlePasswordFormChange("newPasswordConfirm")}
          type="password"
        />
      </Box>
    </Box>
  );
}
