import React, { useState } from "react";
import {
  TextField,
  Box,
  Snackbar,
  IconButton,
  InputAdornment,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { checkFriendRequestStatus, sendFriendRequest } from "@/services/friendService";
import { getUserByEmail } from "@/services/userService";
import { useUser } from "@/contexts/UserContext";

const AddFriend: React.FC = () => {
  const [emailInput, setEmailInput] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [error, setError] = useState("");
  const [helperText, setHelperText] = useState("");
  const { user } = useUser(); // Assuming useUser returns an object with a user field

  const handleInviteClick = async () => {
    if (!emailInput) {
      setError("Please enter an email address.");
      return;
    }
    if (user && user.email === emailInput) {
      setError("you cannot add yourself as a friend.");
      return;
    }

    try {
      const receiver = await getUserByEmail(emailInput);
      if (!receiver || !receiver.id) {
        setError("user could not be found.");
        return;
      }

      if (!user) {
        setError("please authenticate yourself first!");
        return;
      }

      const requestStatus = await checkFriendRequestStatus(user.id ?? "", receiver.id);
      if (requestStatus.exists) {
        setError("friend request pending or you are already friends");
        return;
      }

      await sendFriendRequest(user.id ?? "", receiver.id ?? "");
      setEmailInput("");
      setSnackbarOpen(true);
      setHelperText("friend request sent successfully");
    } catch (error) {
      setError("failed to send invite.");
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setError("");
    setHelperText("");
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
        error={!!error}
        helperText={error || helperText}
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
        message={helperText}
      />
    </Box>
  );
};

export default AddFriend;
