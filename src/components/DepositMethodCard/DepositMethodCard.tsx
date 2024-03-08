import React from "react";
import { DepositDetailsForm } from "@/app/account/deposit/types";
import { Box, Typography, IconButton } from "@mui/material";
import styles from "./DepositMethodCard.module.css";
import FormTextField from "../FormTextField/FormTextField";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PaypalIcon from "@mui/icons-material/Payments";
import CryptoIcon from "@mui/icons-material/AccountBalanceWallet";

interface DepositMethodCardProps {
  depositDetailsForm: DepositDetailsForm;
  handleDepositDetailsFormChange: (prop: string) => (event: {
    target: {
      value: any;
    };
  }) => void;
}
export default function DepositMethodCard({
  depositDetailsForm,
  handleDepositDetailsFormChange,
}: DepositMethodCardProps) {
  const isSelected = (method: string) => depositDetailsForm.method === method;

  return (
    <Box className={styles.container}>
      <Box className={styles.titleContainer}>
        <Typography className={styles.title}>Deposit Details</Typography>
      </Box>
      <Box sx={{ paddingTop: "10px" }}>
        <Box className={styles.twoBox}>
          <FormTextField
            idName="amount"
            labelName="Amount"
            value={depositDetailsForm.amount.toString()}
            onChange={handleDepositDetailsFormChange("amount")}
          />
        </Box>
        <Box className={styles.paymentMethodContainer}>
          <IconButton
            color={isSelected("card") ? "primary" : "default"}
            onClick={() =>
              handleDepositDetailsFormChange("method")({
                target: { value: "card" },
              })
            }
          >
            <CreditCardIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
