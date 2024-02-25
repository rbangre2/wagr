// Header.tsx
import React from "react";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import styles from "./Header.module.css";

interface HeaderProps {
  handleDrawerOpen: () => void;
  drawerOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ handleDrawerOpen, drawerOpen }) => {
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
            fontFamily: "Alex Brush, cursive",
            fontWeight: 400,
            fontSize: "3rem",
            fontStyle: "normal",
          }}
        >
          wagr
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
