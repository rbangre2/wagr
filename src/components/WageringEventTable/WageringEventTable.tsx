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

// Define the type for a single event's data
interface WageringEvent {
  event: string;
  currentOdds: number;
  chart?: string; // To be implemented later
  changePercent: number;
  volume: number;
  supply: number;
}

// Define the type for the props of the WageringEventTable component
interface WageringEventTableProps {
  wageringEvents: WageringEvent[];
  // Include any other props like sorting and filtering functions if needed
}

const WageringEventTable: React.FC<WageringEventTableProps> = ({
  wageringEvents,
}) => {
  const router = useRouter();
  const handleTrade = (event: WageringEvent) => {
    router.push(`/dashboard/bets/eventId`);
    console.log("Trade button clicked for event:", event);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Chart</TableCell>
            <TableCell align="right">Change %</TableCell>
            <TableCell align="right">Volume</TableCell>
            <TableCell align="right">Supply</TableCell>
            <TableCell align="right">Trade</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {wageringEvents.map((event, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {event.event}
              </TableCell>
              <TableCell align="right">{event.currentOdds}</TableCell>
              <TableCell align="right">{event.chart}</TableCell>{" "}
              {/* To be replaced with actual chart */}
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
