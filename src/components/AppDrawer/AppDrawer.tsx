// AppDrawer.tsx
import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

interface AppDrawerProps {
  open: boolean;
  handleDrawerClose: () => void;
  drawerWidth: number;
  minimizedDrawerWidth: number;
  appBarHeight: number;
}

const AppDrawer: React.FC<AppDrawerProps> = ({
  open,
  handleDrawerClose,
  drawerWidth,
  minimizedDrawerWidth,
  appBarHeight,
}) => {
  const theme = useTheme();

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
          backgroundColor: "#333740", // Set the background color to light gray
          color: "#FFFFFF",
          boxSizing: "border-box",
          transition: theme.transitions.create(["width", "top"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      <Divider />
      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon style={{ color: "#FFFFFF" }}>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default AppDrawer;
