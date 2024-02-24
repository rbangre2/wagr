"use client";
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  CssBaseline,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AppDrawer from "@/components/AppDrawer/AppDrawer";

const appBarHeight = 65; // The height of your AppBar, adjust as needed
const drawerWidth = 240;
const minimizedDrawerWidth = 56;

const HomePage: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);

  const handleDrawerClose = (): void => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ backgroundColor: "#1A1B1E" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerClose}
            sx={{ marginRight: "36px" }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            wagr
          </Typography>
        </Toolbar>
      </AppBar>
      <AppDrawer
        open={drawerOpen}
        handleDrawerClose={handleDrawerClose}
        drawerWidth={drawerWidth}
        minimizedDrawerWidth={minimizedDrawerWidth}
        appBarHeight={appBarHeight}
      />
      {/* Content here */}
    </Box>
  );
};

export default HomePage;
