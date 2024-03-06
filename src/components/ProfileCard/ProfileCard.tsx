import React from "react";
import { Box, Button } from "@mui/material";
import {
  PasswordChangeForm,
  PersonalDetailsForm,
} from "@/app/account/profile/types";
import styles from "./ProfileCard.module.css";
import ChangePfpCard from "../ChangePfpCard/ChangePfpCard";
import ChangePasswordCard from "../ChangePasswordCard/ChangePasswordCard";
import ChangePersonalDetailsCard from "../ChangePersonalDetailsCard/ChangePersonalDetailsCard";

interface ProfileCardProps {
  passwordChangeForm: PasswordChangeForm;
  handlePasswordFormChange: (prop: string) => (event: {
    target: {
      value: any;
    };
  }) => void;
  personalDetailsForm: PersonalDetailsForm;
  handlePersonalDetailsFormChange: (prop: string) => (event: {
    target: {
      value: any;
    };
  }) => void;
  newPfpBlob: Blob | null;
  setNewPfpBlob: React.Dispatch<React.SetStateAction<Blob | null>>;
  handleClearPfp: () => void;
  pfpSource: string;
  handleProfileTabClear: () => void;
  onSubmitTab: () => void;
}

export default function ProfileCard({
  passwordChangeForm,
  handlePasswordFormChange,
  personalDetailsForm,
  handlePersonalDetailsFormChange,
  newPfpBlob,
  setNewPfpBlob,
  handleClearPfp,
  pfpSource,
  handleProfileTabClear,
  onSubmitTab,
}: ProfileCardProps) {
  return (
    <Box className={styles.container}>
      <Box className={styles.topRow}>
        <ChangePfpCard
          newPfpBlob={newPfpBlob}
          setNewPfpBlob={setNewPfpBlob}
          handleClearPfp={handleClearPfp}
          pfpSource={pfpSource}
        />
        <ChangePasswordCard
          passwordChangeForm={passwordChangeForm}
          handlePasswordFormChange={handlePasswordFormChange}
        />
      </Box>

      <ChangePersonalDetailsCard
        personalDetailsForm={personalDetailsForm}
        handlePersonalDetailsFormChange={handlePersonalDetailsFormChange}
      />
      <Box className={styles.buttonContainer}>
        <Button
          variant="contained"
          className={styles.saveButton}
          onClick={onSubmitTab}
          disabled={
            Object.values(personalDetailsForm).some((value) => value === "") ||
            (passwordChangeForm.currentPassword === "" &&
              passwordChangeForm.newPassword !==
                passwordChangeForm.newPasswordConfirm) ||
            (passwordChangeForm.currentPassword !== "" &&
              passwordChangeForm.newPassword !==
                passwordChangeForm.newPasswordConfirm) ||
            (passwordChangeForm.currentPassword !== "" &&
              passwordChangeForm.newPassword === "" &&
              passwordChangeForm.newPasswordConfirm === "")
          }
        >
          Save
        </Button>
        <Button
          variant="contained"
          className={styles.cancelButton}
          onClick={handleProfileTabClear}
        >
          Clear
        </Button>
      </Box>
    </Box>
  );
}
