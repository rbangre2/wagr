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
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 90,
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontFamily: "'PT Sans Narrow', sans-serif",
              fontWeight: 700,
            }}
          >
            Friends
          </Typography>
          <AddFriend />
        </Box>
        <FriendsTable />
      </Box>
    </DashboardLayout>
  );
}
