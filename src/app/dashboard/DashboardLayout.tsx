import React, { useState } from "react";
import { CssBaseline, Box } from "@mui/material";
import Header from "@/components/Header/Header";
import AppDrawer from "@/components/AppDrawer/AppDrawer";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const appBarHeight = 65; // Adjust as needed
const drawerWidth = 240;
const minimizedDrawerWidth = 56;

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);

  const handleDrawerOpen = (): void => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header handleDrawerOpen={handleDrawerOpen} drawerOpen={drawerOpen} />
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
        {children} {/* This is where the routed content will be rendered */}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
