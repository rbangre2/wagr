"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import { SignupForm } from "../../../components/SignupForm/SignupForm";
import styles from "./page.module.css"; // Assuming you're using CSS Modules

const SignupPage = () => {
  return (
    <Box className={styles.pageContainer}>
      <Box className={styles.leftContainer}>
        <Typography
          className={styles.logoText}
          style={{
            fontFamily: "var(--font)",
            fontWeight: "700",
            fontSize: "100px",
            color: "#e8ecf8",
          }}
        >
          wagr
        </Typography>
      </Box>
      <Box className={styles.rightContainer}></Box>
    </Box>
  );
};

export default SignupPage;
