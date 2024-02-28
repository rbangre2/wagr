import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { AddUser } from "./types";

// Mock data for users - replace with your actual data fetching logic
const users: AddUser[] = [
  { id: "u1", email: "alice@example.com" },
  { id: "u2", email: "bob@example.com" },
  { id: "u3", email: "charlie@example.com" },
];

const AddFriend: React.FC = () => {
  const [emailInput, setEmailInput] = useState("");

  const sendFriendInvite = (email: string) => {
    console.log("Sending invite to:", email);
  };

  const handleInviteClick = () => {
    const user = users.find((user) => user.email === emailInput);
    if (user) {
      sendFriendInvite(user.email);
      setEmailInput(""); // Clear the input after sending invite
    } else {
      alert("User not found");
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <TextField
        size="small"
        label="Enter Email"
        variant="outlined"
        value={emailInput}
        onChange={(e) => setEmailInput(e.target.value)}
        sx={{ minWidth: "200px" }}
      />
      <Button
        variant="contained"
        color="secondary" // You can change 'secondary' to whatever color fits your theme.
        onClick={handleInviteClick}
        disabled={!emailInput}
        startIcon={<SendIcon />}
        sx={{
          boxShadow: "none",
          textTransform: "none",
          fontSize: 16,
          padding: "6px 12px",
          lineHeight: 1.5,
          backgroundColor: "#5c6bc0",
          "&:hover": {
            backgroundColor: "#3f51b5",
          },
        }}
      >
        Invite Friend
      </Button>
    </Box>
  );
};

export default AddFriend;
