import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { AddUser } from "./types";
import { User } from "@/models/User";
import { sendFriendReqeust } from "@/services/friendService";
import { getUserByEmail } from "@/services/userService";
import { useUser } from "@/contexts/UserContext";

const AddFriend: React.FC = () => {
  const [emailInput, setEmailInput] = useState("");
  const user = useUser();

  const handleInviteClick = async () => {
    try {
      const receiver = await getUserByEmail(emailInput);
      if (user.user && user.user.id && receiver && receiver.id) {
        await sendFriendReqeust(user.user.id, receiver.id);
        console.log("Invite sent successfully.");
        setEmailInput("");
      } else {
        alert("User not found.");
      }
    } catch (error) {
      console.error("Failed to send invite:", error);
      alert("Failed to send invite.");
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
        color="secondary"
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
