"use client";
import React, { useState } from "react";
import { CssBaseline, Box } from "@mui/material";
import Header from "@/components/Header/Header";
import AppDrawer from "@/components/AppDrawer/AppDrawer";

const appBarHeight = 65;
const drawerWidth = 240;
const minimizedDrawerWidth = 56;

const HomePage: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);

  const handleDrawerOpen = (): void => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = (): void => {
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header handleDrawerOpen={handleDrawerOpen} drawerOpen={drawerOpen} />
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
