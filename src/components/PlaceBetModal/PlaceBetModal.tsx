import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
  FormControl,
  Typography,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Event } from "@/models/Event";
import { useUser } from "@/contexts/UserContext";
import { Friend } from "@/models/User";
import { getFriends } from "@/services/friendService";
import styles from "./PlaceBetModal.module.css";
import { createBet } from "@/services/betService";

interface PlaceBetProps {
  open: boolean;
  onClose: () => void;
  event: Event;
}

const PlaceBet: React.FC<PlaceBetProps> = ({ open, onClose, event }) => {
  const [friendsList, setFriendsList] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<string>("");
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [odds, setOdds] = useState("");
  const [amount, setAmount] = useState("");
  const [potentialPayout, setPotentialPayout] = useState<number>(0);
  const user = useUser().user;

  useEffect(() => {
    async function fetchFriends() {
      if (user && user.id) {
        const friends = await getFriends(user.id);
        setFriendsList(friends);
      }
    }

    fetchFriends();
  }, [user]);

  useEffect(() => {
    const numericOdds = parseFloat(odds);
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericOdds) && !isNaN(numericAmount)) {
      setPotentialPayout(numericOdds * numericAmount);
    }
  }, [odds, amount]);

  const handlePlaceBet = async () => {
    if (user && user.id) {
      if (!selectedFriend || !odds || !amount) {
        return;
      }

      const newBet = {
        senderId: user?.id,
        receiverId: selectedFriend,
        senderSelection: selectedTeam,
        eventId: event.id,
        senderBetChoice: selectedTeam,
        amount: parseFloat(amount),
        odds: parseFloat(odds),
        status: "Pending" as "Pending",
        createdAt: new Date(),
      };

      try {
        await createBet(newBet);
        onClose();
      } catch (error) {
        console.error("Error placing bet: ", error);
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose} className={styles.container}>
      <div className={styles.modalContent}>
        <IconButton onClick={onClose} className={styles.closeButton}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" className={styles.title}>
          {event.homeTeam + " vs. " + event.awayTeam}
        </Typography>
        <FormControl fullWidth className={styles.friendSelect} required>
          <InputLabel id="select-friend-label">Choose a Friend</InputLabel>
          <Select
            labelId="select-friend-label"
            id="select-friend"
            value={selectedFriend}
            label="Choose a Friend"
            onChange={(e) => setSelectedFriend(e.target.value as string)}
          >
            {friendsList.map((friend) => (
              <MenuItem key={friend.id} value={friend.id}>
                {friend.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth className={styles.teamSelect} required>
          <InputLabel id="select-team-label">Choose a Team</InputLabel>
          <Select
            labelId="select-team-label"
            id="select-team"
            value={selectedTeam}
            label="Choose a Team"
            onChange={(e) => setSelectedTeam(e.target.value as string)}
          >
            <MenuItem value={event.homeTeam}>{event.homeTeam}</MenuItem>
            <MenuItem value={event.awayTeam}>{event.awayTeam}</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Odds"
          value={odds}
          onChange={(e) => setOdds(e.target.value)}
          className={styles.formControl}
          required
        />
        <TextField
          fullWidth
          label="Wager Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          className={styles.formControl}
          required
        />
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              sx={{ backgroundColor: "#6082B6" }}
              onClick={handlePlaceBet}
            >
              Place Bet
            </Button>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1">
              Potential Payout: ${potentialPayout.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
      </div>
    </Modal>
  );
};

export default PlaceBet;
