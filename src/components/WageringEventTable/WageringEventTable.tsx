import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Filter, Sport, League } from "@/app/dashboard/bets/types";

interface WageringEvent {
  event: string;
  currentOdds: number;
  chart?: string;
  changePercent: number;
  volume: number;
  supply: number;
  sport: Sport;
  league: League;
}

interface WageringEventTableProps {
  wageringEvents: WageringEvent[];
  filters: Filter;
}

const WageringEventTable: React.FC<WageringEventTableProps> = ({
  wageringEvents,
  filters,
}) => {
  const router = useRouter();
  const handleTrade = (event: WageringEvent) => {
    router.push(`/dashboard/bets/eventId`);
    console.log("Trade button clicked for event:", event);
  };

  const filteredEvents = wageringEvents.filter((event) => {
    const matchesSport = event.sport === filters.sport;
    const matchesLeague = event.league === filters.league;

    if (filters.sport == Sport.None && filters.league == League.None) {
      return true;
    } else if (filters.sport == Sport.None) {
      return matchesLeague;
    } else if (filters.league == League.None) {
      return matchesSport;
    }
    return matchesSport && matchesLeague;
  });

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Change %</TableCell>
            <TableCell align="right">Volume</TableCell>
            <TableCell align="right">Supply</TableCell>
            <TableCell align="right">Trade</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredEvents.map((event, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {event.event}
              </TableCell>
              <TableCell align="right">{event.currentOdds}</TableCell>
              <TableCell align="right">
                {event.changePercent.toFixed(2)}%
              </TableCell>
              <TableCell align="right">{event.volume}</TableCell>
              <TableCell align="right">{event.supply}</TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleTrade(event)}
                >
                  Trade
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WageringEventTable;
