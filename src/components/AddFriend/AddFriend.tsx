import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Snackbar,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Notification, ActivityType } from "@/models/Notification";
import SendIcon from "@mui/icons-material/Send";
import { sendFriendRequest } from "@/services/friendService";
import { getUserByEmail } from "@/services/userService";
import { useUser } from "@/contexts/UserContext";
import { createNotification } from "@/services/notificationService";

const AddFriend: React.FC = () => {
  const [emailInput, setEmailInput] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("");
  const { user } = useUser();

  const handleInviteClick = async () => {
    try {
      const receiver = await getUserByEmail(emailInput);
      if (user && user.id && receiver && receiver.id) {
        await sendFriendRequest(user.id, receiver.id);
        console.log("invite sent successfully.");

        const message = `${user.firstName} ${user.lastName} has sent you a friend request!`;

        await createNotification(
          receiver.id,
          ActivityType.NEW_FRIEND_REQUEST,
          message
        );

        setEmailInput("");
        setError(false);
        setHelperText("");
        setSnackbarOpen(true);
      } else {
        setError(true);
        setHelperText("user could not be found.");
      }
    } catch (error) {
      setError(true);
      setHelperText("failed to send invite.");
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-end",
        gap: 2,
      }}
    >
      <TextField
        size="small"
        label="Enter Email"
        variant="outlined"
        value={emailInput}
        onChange={(e) => setEmailInput(e.target.value)}
        error={error}
        helperText={helperText}
        sx={{ minWidth: "250px" }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                color="primary"
                onClick={handleInviteClick}
                disabled={!emailInput}
              >
                <SendIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="friend request sent successfully"
      />
    </Box>
  );
};

export default AddFriend;