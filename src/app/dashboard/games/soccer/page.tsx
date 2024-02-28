"use client";
import { useEffect, useState } from "react";
import GamesLayout from "../GamesLayout";
import { TableFixture } from "@/models/Fixture";
import { getLaLigaFixtures } from "@/services/sportsService";
import SportsTable from "@/components/SportsTable/SportsTable";
import { soccerColumns } from "./types";

export default function SoccerGames() {
  const [data, setData] = useState<TableFixture[]>([]);
  const tableTitle = "Upcoming Soccer Fixtures";

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const fixtures = await getLaLigaFixtures();
        setData(fixtures);
      } catch (error) {
        console.error("failed to fetch soccer data", error);
      }
    };

    fetchFixtures();
  }, []);
  return (
    <GamesLayout>
      <SportsTable title={tableTitle} columns={soccerColumns} data={data} />
    </GamesLayout>
  );
}
