import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import styles from "./Header.module.css";
import { useRouter } from "next/navigation";
import { logout } from "@/services/userService";
import { useQueryClient } from "react-query";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsButton from "../NotificationsButton/NotificationsButton";

interface HeaderProps {
  handleDrawerOpen: () => void;
  drawerOpen: boolean;
  userName: string;
  balance: number;
}

const Header: React.FC<HeaderProps> = ({
  handleDrawerOpen,
  drawerOpen,
  balance,
  userName,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      queryClient.clear();
      router.push("/auth/signin");
    } catch (error: any) {
      console.log("signout error");
    }
  };

  const handleOpenProfile = () => {
    router.push("/account/profile");
  };

  const handleDeposit = async () => {
    router.push("/account/deposit");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "#F2E9EB",
      }}
    >
      <Toolbar>
        <IconButton
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerOpen}
          sx={{ marginRight: "36px", color: "#31383F" }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          noWrap
          style={{
            flexGrow: 1,
            fontFamily: "Alex Brush, cursive",
            fontWeight: 400,
            fontSize: "3rem",
            fontStyle: "normal",
            color: "#31383F",
          }}
        >
          wagr
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h6"
            sx={{
              marginRight: "20px",
              fontFamily: "'Ubuntu', sans-serif",
              color: "#31383F",
            }}
          >
            {`${userName}`}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              marginRight: "20px",
              fontFamily: "Ubuntu, sans-serif",
              color: "#31383F",
            }}
          >
            {`Balance: $${balance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
          </Typography>
          <NotificationsButton />
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            sx={{ color: "#31383F" }}
          >
            <AccountCircleIcon sx={{ fontSize: "2.5rem" }} />
          </IconButton>
        </Box>

        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          PaperProps={{
            style: {
              marginTop: "35px",
              width: "135px",
            },
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleOpenProfile} className={styles.menu_item}>
            Profile
          </MenuItem>
          <MenuItem onClick={handleDeposit} className={styles.menu_item}>
            Deposit
          </MenuItem>
          <MenuItem onClick={handleMenuClose} className={styles.menu_item}>
            Withdraw
          </MenuItem>
          <MenuItem onClick={handleLogout} className={styles.menu_item}>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
