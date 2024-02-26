"use client";
import React, { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { CssBaseline, Box } from "@mui/material";
import Header from "@/components/Header/Header";
import AppDrawer from "@/components/AppDrawer/AppDrawer";

interface AccountLayoutProps {
  children: React.ReactNode;
}

const appBarHeight = 65;
const drawerWidth = 240;
const minimizedDrawerWidth = 56;

const Layout: React.FC<AccountLayoutProps> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);
  const user = useUser();

  const handleDrawerOpen = (): void => {
    setDrawerOpen(!drawerOpen);
  };
  const balance = user?.user?.balance || 0;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header
        handleDrawerOpen={handleDrawerOpen}
        drawerOpen={drawerOpen}
        balance={balance}
      />
      <AppDrawer
        open={drawerOpen}
        handleDrawerClose={handleDrawerOpen}
        drawerWidth={drawerWidth}
        minimizedDrawerWidth={minimizedDrawerWidth}
        appBarHeight={appBarHeight}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: `${appBarHeight}px`,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
