// Header.tsx
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
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // Icon for user settings

interface HeaderProps {
  handleDrawerOpen: () => void;
  drawerOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ handleDrawerOpen, drawerOpen }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "#1A1B1E",
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerOpen}
          sx={{ marginRight: "36px" }}
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
          }}
        >
          wagr
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6" sx={{ marginRight: "20px" }}>
            Balance: $0.00
          </Typography>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircleIcon />
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
          <MenuItem onClick={handleMenuClose} className={styles.menu_item}>
            Profile
          </MenuItem>
          <MenuItem onClick={handleMenuClose} className={styles.menu_item}>
            Deposit
          </MenuItem>
          <MenuItem onClick={handleMenuClose} className={styles.menu_item}>
            Withdraw
          </MenuItem>
          <MenuItem onClick={handleMenuClose} className={styles.menu_item}>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
