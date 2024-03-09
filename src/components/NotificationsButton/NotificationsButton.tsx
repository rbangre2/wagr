import React, { useState } from "react";
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Typography,
  Box,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useRouter } from "next/navigation";
import { ActivityType, Notification } from "@/models/Notification";
import { formatDistanceToNow } from "date-fns";
import styles from "./NotificationsButton.module.css";

const MAX_NOTIFICATIONS_DISPLAY = 5;

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: ActivityType.NEW_FRIEND_REQUEST,
    message: "You have a new friend request from Alice.",
    read: false,
    date: new Date(),
  },
  {
    id: "2",
    type: ActivityType.FRIEND_REQUEST_ACCEPTED,
    message: "Alice has accepted your friend request.",
    read: false,
    date: new Date(new Date().getTime() - 1 * 60000), // 1 minute ago
  },
  {
    id: "3",
    type: ActivityType.NEW_BET_CHALLENGE,
    message: "Charlie invited you to a bet.",
    read: false,
    date: new Date(new Date().getTime() - 2 * 60000), // 2 minutes ago
  },
  {
    id: "4",
    type: ActivityType.MARKET_ORDER_FILLED,
    message: "Your market order has been filled.",
    read: false,
    date: new Date(new Date().getTime() - 5 * 60000), // 5 minutes ago
  },
  {
    id: "5",
    type: ActivityType.EVENT_SETTLED,
    message: "The event you bet on has settled.",
    read: false,
    date: new Date(new Date().getTime() - 10 * 60000), // 10 minutes ago
  },
  {
    id: "6",
    type: ActivityType.EVENT_SETTLED,
    message: "The event you bet on has settled.",
    read: false,
    date: new Date(new Date().getTime() - 10 * 60000), // 10 minutes ago
  },
];

const NotificationsButton: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const router = useRouter();

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewAll = () => {
    handleClose();
    router.push("/account/activity");
  };

  const formatRelativeTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  // Calculate unread count
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <div>
      <IconButton
        size="large"
        aria-label="show notifications"
        onClick={handleOpen}
        className={styles.badge}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon className={styles.notificationIcon} />
        </Badge>
      </IconButton>
      <Menu
        id="notifications-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        classes={{ paper: styles.menu }}
      >
        {notifications.map((notification) => (
          <MenuItem
            key={notification.id}
            onClick={handleClose}
            className={styles.menuItem}
          >
            <Box>
              <Typography variant="body1">{notification.message}</Typography>
              <Typography
                variant="caption"
                style={{ color: "#aaa", marginTop: "4px" }}
              >
                {formatRelativeTime(notification.date)}{" "}
              </Typography>
            </Box>
          </MenuItem>
        ))}
        {notifications.length > MAX_NOTIFICATIONS_DISPLAY && (
          <div>
            <Divider />
            <MenuItem onClick={handleViewAll} className={styles.menuItem}>
              <Typography color="primary">View all notifications</Typography>
            </MenuItem>
          </div>
        )}
      </Menu>
    </div>
  );
};

export default NotificationsButton;
