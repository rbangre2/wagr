import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
} from "@mui/material";
import styles from "./AppDrawer.module.css";
import { useRouter } from "next/navigation";
import GamesIcon from "@mui/icons-material/SportsSoccer";
import BetsIcon from "@mui/icons-material/AccountBalance";
import MyBetsIcon from "@mui/icons-material/Casino";
import FriendsIcon from "@mui/icons-material/People";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ResultsIcon from "@mui/icons-material/Insights";
import SettingsIcon from "@mui/icons-material/Settings";
import StakeIcon from "@mui/icons-material/CurrencyExchange";

interface AppDrawerProps {
  open: boolean;
  handleDrawerClose: () => void;
  drawerWidth: number;
  minimizedDrawerWidth: number;
  appBarHeight: number;
}

const drawerItems = [
  { text: "Games", icon: <GamesIcon /> },
  { text: "Market", icon: <BetsIcon /> },
  { text: "Wagers", icon: <MyBetsIcon /> },
  { text: "Stake", icon: <StakeIcon /> },
  { text: "Friends", icon: <FriendsIcon /> },
  { text: "Leagues", icon: <EmojiEventsIcon /> },
  { text: "Results", icon: <ResultsIcon /> },
  { text: "Settings", icon: <SettingsIcon /> },
];

const AppDrawer: React.FC<AppDrawerProps> = ({
  open,
  handleDrawerClose,
  drawerWidth,
  minimizedDrawerWidth,
  appBarHeight,
}) => {
  const theme = useTheme();
  const router = useRouter();

  const handleNavigation = (text: string) => {
    const path = `/dashboard/${text.toLowerCase()}`;
    router.push(path);
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : minimizedDrawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : minimizedDrawerWidth,
          top: appBarHeight,
          height: `calc(100% - ${appBarHeight}px)`,
          backgroundColor: "#333740",
          color: "#FFFFFF",
          boxSizing: "border-box",
          transition: theme.transitions.create(["width", "top"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
      }}
    >
      <List sx={{ paddingTop: "22px" }}>
        {drawerItems.slice(0, 5).map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => handleNavigation(item.text)}
          >
            <ListItemIcon sx={{ color: "#FFFFFF" }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                "& .MuiListItemText-primary": {
                  fontFamily: '"Signika Negative", sans-serif',
                  fontSize: "1.2rem",
                },
              }}
            />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <List>
        {drawerItems.slice(5).map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => handleNavigation(item.text)}
          >
            <ListItemIcon sx={{ color: "#FFFFFF" }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                "& .MuiListItemText-primary": {
                  fontFamily: '"Signika Negative", sans-serif',
                  fontSize: "1.2rem",
                },
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default AppDrawer;
