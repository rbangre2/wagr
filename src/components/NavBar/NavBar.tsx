import { Box, Typography } from "@mui/material";
import React from "react";

import { IconBell, IconLock, IconUserCircle } from "@tabler/icons-react";
import styles from "./NavBar.module.css";

interface NavBarProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const tabs = [
  {
    title: "Profile",
    icon: <IconUserCircle size={18} className={styles.tabIcon} />,
    tabName: "profile",
  },
  {
    title: "Notifications",
    icon: <IconBell size={18} className={styles.tabIcon} />,
    tabName: "notifications",
  },
];

export default function NavBar({ activeTab, setActiveTab }: NavBarProps) {
  return (
    <Box className={styles.container}>
      {tabs.map((item, idx) => (
        <Box
          key={item.tabName}
          className={styles.tabContainer}
          onClick={() => setActiveTab(item.tabName)}
          style={{
            borderBottom:
              activeTab === item.tabName ? "2px solid var(--accent)" : "none",
            color: activeTab === item.tabName ? "var(--accent)" : "inherit",
            marginLeft: idx === 0 ? "6px" : "none",
          }}
        >
          {item.icon}
          <Typography className={styles.tabText}>{item.title}</Typography>
        </Box>
      ))}
    </Box>
  );
}
