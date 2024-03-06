"use client";
import { useUser } from "@/contexts/UserContext";
import React, { useState } from "react";
import {
  PasswordChangeForm,
  PersonalDetailsForm,
  passwordChangeFormObject,
  personalDetailsFormObject,
} from "./types";
import styles from "./page.module.css";
import { Box, Typography } from "@mui/material";
import NavBar from "@/components/NavBar/NavBar";
import ProfileCard from "@/components/ProfileCard/ProfileCard";

export default function MyAccount() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("profile");
  const [newProfilePictureBlob, setNewProfilePictureBlob] =
    useState<Blob | null>(null);

  const [passwordChangeForm, setPasswordChangeForm] =
    useState<PasswordChangeForm>(passwordChangeFormObject);

  const [personalDetailsForm, setPersonalDetailsForm] =
    useState<PersonalDetailsForm>(personalDetailsFormObject);

  const handleClearProfilePictureBlob = () => {
    setNewProfilePictureBlob(null);
  };

  const handlePasswordFormChange =
    (prop: string) => (event: { target: { value: any } }) => {
      setPasswordChangeForm({
        ...passwordChangeForm,
        [prop]: event.target.value,
      });
    };

  const handlePersonalDetailsFormChange =
    (prop: string) => (event: { target: { value: any } }) => {
      setPersonalDetailsForm({
        ...personalDetailsForm,
        [prop]: event.target.value,
      });
    };

  const handleProfileTabClear = () => {
    setNewProfilePictureBlob(null);
    setPasswordChangeForm(passwordChangeFormObject);
    setPersonalDetailsForm(personalDetailsFormObject); // should default to users current details
  };

  const onProfileTabSubmit = () => {};

  return (
    <Box className={styles.pageContainer}>
      <Box className={styles.titleContainer}>
        <Typography className={styles.title}>My Account</Typography>
      </Box>
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Box className={styles.innerContainer}>
        <Box className={styles.contentContainer}>
          {activeTab === "profile" && (
            <ProfileCard
              newPfpBlob={newProfilePictureBlob}
              setNewPfpBlob={setNewProfilePictureBlob}
              handleClearPfp={handleClearProfilePictureBlob}
              passwordChangeForm={passwordChangeForm}
              handlePasswordFormChange={handlePasswordFormChange}
              pfpSource={user?.pfpSource || ""}
              personalDetailsForm={personalDetailsForm}
              handlePersonalDetailsFormChange={handlePersonalDetailsFormChange}
              handleProfileTabClear={handleProfileTabClear}
              onSubmitTab={onProfileTabSubmit}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
