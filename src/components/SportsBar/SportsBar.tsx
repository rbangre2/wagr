import React from "react";
import { Tabs, Tab } from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import SportsHockeyIcon from "@mui/icons-material/SportsHockey";
import styles from "./SportsBar.module.css";
import { useRouter, usePathname } from "next/navigation";

const sportsTabs = [
  { label: "Soccer", icon: <SportsSoccerIcon />, value: "soccer" },
  { label: "Basketball", icon: <SportsBasketballIcon />, value: "basketball" },
  { label: "Hockey", icon: <SportsHockeyIcon />, value: "hockey" },
  // Add more sports and icons as needed
];

const SportsBar: React.FC = () => {
  const router = useRouter();
  const currentSport = usePathname().split("/").pop();

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    router.push(`/dashboard/games/${newValue}`);
  };

  return (
    <Tabs
      value={currentSport}
      onChange={handleTabChange}
      centered
      className={styles.bar}
    >
      {sportsTabs.map((sport) => (
        <Tab
          key={sport.value}
          label={sport.label}
          icon={sport.icon}
          value={sport.value}
          iconPosition="start"
          className={styles.tab}
        />
      ))}
    </Tabs>
  );
};

export default SportsBar;
