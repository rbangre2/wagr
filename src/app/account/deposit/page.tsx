"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useUser } from "@/contexts/UserContext";
import { updateBalance } from "@/services/userService";

const DepositPage: React.FC = () => {
  const [amount, setAmount] = useState("");
  const { user, setUser } = useUser();
  const router = useRouter();

  const handleDeposit = async () => {
    // Parse the amount to a number and ensure it's not negative
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      alert("Please enter a valid amount to deposit.");
      return;
    }

    try {
      // Mock service function to update the user's balance
      const updatedUser = await updateBalance(user?.id, depositAmount);
      setUser(updatedUser);
    } catch (error) {
      console.error("Error depositing funds:", error);
      alert("Failed to deposit funds. Please try again later.");
    }
  };

  return (
    <Box sx={{ maxWidth: "320px", mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Deposit Funds
      </Typography>
      <TextField
        label="Amount to deposit"
        variant="outlined"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        margin="normal"
        type="number"
        InputProps={{ inputProps: { min: 0 } }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleDeposit}
        fullWidth
      >
        Deposit
      </Button>
    </Box>
  );
};

export default DepositPage;
