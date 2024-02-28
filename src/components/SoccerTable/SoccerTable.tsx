import React from "react";
import SportsTable from "@/components/SportsTable/SportsTable";
import { soccerData } from "@/components/SoccerTable/mock"; // Your soccer data


const SoccerTable = () => {
  return <SportsTable title="Upcoming Soccer Games" data={soccerData} />;
};


export default SoccerTable;

