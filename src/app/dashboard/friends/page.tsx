"use client";
import DashboardLayout from "../DashboardLayout";
import { Box, Typography } from "@mui/material";
import styles from "./page.module.css";
import FriendsTable from "@/components/FriendsTable/FriendsTable";
import AddFriend from "@/components/AddFriend/AddFriend";

export default function Friends() {
  return (
    <DashboardLayout>
      <Box className={styles.friendsContainer}>
        <Box className={styles.leftSide}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              marginBottom: "20px",
              fontFamily: "'PT Sans Narrow', sans-serif",
              fontWeight: 700,
            }}
          >
            Friends!
          </Typography>
          <FriendsTable />
        </Box>
        <Box className={styles.rightSide}>
          <AddFriend />
        </Box>
      </Box>
    </DashboardLayout>
  );
}
