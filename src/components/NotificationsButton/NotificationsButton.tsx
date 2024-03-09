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
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getUserNotifications,
  readNotification,
} from "@/services/notificationService";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { formatDistanceToNow } from "date-fns";
import styles from "./NotificationsButton.module.css";

const MAX_NOTIFICATIONS_DISPLAY = 5;

const NotificationsButton: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const queryClient = useQueryClient();
  let unreadCount = 0;
  const { user } = useUser();
  const { data: notifications } = useQuery(
    "notifications",
    () => getUserNotifications(user?.id, MAX_NOTIFICATIONS_DISPLAY),
    {
      staleTime: 300000,
      enabled: !!user?.id,
    }
  );

  const mutation = useMutation(readNotification, {
    onSuccess: () => {
      queryClient.invalidateQueries("notifications");
    },
  });

  const router = useRouter();

  const handleOpen = async (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);

    // Ensure user and user.id are not undefined before proceeding
    if (user && user.id && notifications) {
      const userId = user.id;
      try {
        await Promise.all(
          notifications.map((notification) =>
            mutation.mutateAsync({
              userId: userId,
              notificationId: notification.id,
            })
          )
        );
      } catch (error) {
        console.error("failed to update notifications", error);
      }
    }
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
  let noNotificationsMessage = null;
  if (notifications) {
    unreadCount = notifications.filter(
      (notification) => !notification.read
    ).length;
    if (notifications.length === 0) {
      noNotificationsMessage = "No notifications";
    }
  }
  return (
    <div>
      <IconButton
        size="large"
        aria-label="show notifications"
        onClick={handleOpen}
        className={styles.badge}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon
            className={styles.notificationIcon}
            sx={{ fontSize: "1.8rem" }}
          />
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
        {notifications &&
          notifications.map((notification) => (
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
        {noNotificationsMessage && (
          <MenuItem className={styles.menuItem}>
            <Typography color="textSecondary" style={{ margin: "auto" }}>
              {noNotificationsMessage}
            </Typography>
          </MenuItem>
        )}
        {notifications && notifications.length > MAX_NOTIFICATIONS_DISPLAY && (
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
