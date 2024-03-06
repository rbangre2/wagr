import React from "react";
import { Box, Typography } from "@mui/material";
import FormTextField from "@/components/FormTextField/FormTextField";
import { PersonalDetailsForm } from "@/app/account/profile/types";
import styles from "./ChangePersonalDetailsCard.module.css";

interface ChangePersonalDetailsCardProps {
  personalDetailsForm: PersonalDetailsForm;
  handlePersonalDetailsFormChange: (prop: string) => (event: {
    target: {
      value: any;
    };
  }) => void;
}

export default function ChangePersonalDetailsCard({
  personalDetailsForm,
  handlePersonalDetailsFormChange,
}: ChangePersonalDetailsCardProps) {
  return (
    <Box className={styles.container}>
      <Box className={styles.titleContainer}>
        <Typography className={styles.title}>Personal Details</Typography>
        <Typography className={styles.subtitle}>
          To edit your personal details, please modify the below form and click
          save!
        </Typography>
      </Box>
      <Box className={styles.formContainer}>
        <Box className={styles.twoBox}>
          <FormTextField
            idName="username"
            labelName="Username"
            value={personalDetailsForm.username}
            width="49%"
            onChange={handlePersonalDetailsFormChange("username")}
          />
        </Box>
        <Box className={styles.twoBox}>
          <FormTextField
            idName="firstName"
            labelName="Your First Name"
            value={personalDetailsForm.firstName}
            onChange={handlePersonalDetailsFormChange("firstName")}
          />
          <Box className={styles.spacer} />
          <FormTextField
            idName="lastName"
            labelName="Your Last Name"
            value={personalDetailsForm.lastName}
            onChange={handlePersonalDetailsFormChange("lastName")}
          />
        </Box>
        <Box className={styles.twoBox}>
          <FormTextField
            idName="email"
            labelName="Email"
            value={personalDetailsForm.email}
            onChange={handlePersonalDetailsFormChange("email")}
          />
          <Box className={styles.spacer} />
          <FormTextField
            idName="phoneNumber"
            labelName="Phone Number"
            value={personalDetailsForm.phoneNumber}
            onChange={handlePersonalDetailsFormChange("phoneNumber")}
          />
        </Box>
      </Box>
    </Box>
  );
}
