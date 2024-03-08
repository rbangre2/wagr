"use client";
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import styles from "./page.module.css";
import { useUser } from "@/contexts/UserContext";
import {
  CreditCardDetailsForm,
  DepositDetailsForm,
  defaultCreditCardDetailsForm,
  defaultDepositDetailsForm,
} from "./types";
import DepositCard from "@/components/DepositCard/DepositCard";
import { deposit } from "@/services/userService";

export default function DepositPage() {
  const [depositDetailsForm, setDepositDetailsForm] =
    useState<DepositDetailsForm>(defaultDepositDetailsForm);
  const [creditCardDetailsForm, setCreditCardDetailsForm] =
    useState<CreditCardDetailsForm>(defaultCreditCardDetailsForm);
  const { user, setUser } = useUser();

  const handlePersonalDetailsFormChange =
    (prop: string) => (event: { target: { value: any } }) => {
      setDepositDetailsForm({
        ...depositDetailsForm,
        [prop]: event.target.value,
      });
    };

  const handleCreditCardDetailsFormChange =
    (prop: string) => (event: { target: { value: any } }) => {
      setCreditCardDetailsForm({
        ...creditCardDetailsForm,
        [prop]: event.target.value,
      });
    };

  const handleDeposit = async (depositAmount: number) => {
    if (!user) {
      console.error("please authenticate yourself before depositing!");
      return;
    }
    const updatedUser = await deposit(user?.id, depositAmount);
    setUser(updatedUser);
  };

  const handleClear = () => {
    setDepositDetailsForm(defaultDepositDetailsForm);
    setCreditCardDetailsForm(defaultCreditCardDetailsForm);
  };

  return (
    <Box className={styles.pageContainer}>
      <Box className={styles.headerContainer}>
        <LockIcon className={styles.lockIcon} />
        <Typography variant="h4" className={styles.headerTitle}>
          Deposit Funds
        </Typography>
      </Box>
      <Typography variant="subtitle1" className={styles.headerDescription}>
        Add funds to your account quickly and securely. We use industry-leading
        security measures to keep your information safe.
      </Typography>
      <Box className={styles.innerContainer}>
        <DepositCard
          depositDetailsForm={depositDetailsForm}
          handleDepositDetailsFormChange={handlePersonalDetailsFormChange}
          creditCardDetailsForm={creditCardDetailsForm}
          handleCreditCardDetailsFormChange={handleCreditCardDetailsFormChange}
          handleDeposit={handleDeposit}
          handleClear={handleClear}
        />
      </Box>
    </Box>
  );
}
