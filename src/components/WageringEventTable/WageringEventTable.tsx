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
import ShowChartIcon from "@mui/icons-material/ShowChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import { useRouter } from "next/navigation";
import styles from "./WageringEventsTable.module.css";
import { Filter, Sport, League } from "@/app/dashboard/bets/types";
import { WageringEvent, WageringEventTableProps } from "./types";

const WageringEventTable: React.FC<WageringEventTableProps> = ({
  wageringEvents,
  filters,
}) => {
  const router = useRouter();
  const handleTrade = (event: WageringEvent) => {
    router.push(`/trade/${event.id}`);
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 700 }}
            >
              Name
            </TableCell>
            <TableCell
              align="left"
              style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 700 }}
            >
              Price
            </TableCell>
            <TableCell
              align="left"
              style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 700 }}
            >
              Change %
            </TableCell>
            <TableCell
              align="left"
              style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 700 }}
            >
              Volume
            </TableCell>
            <TableCell
              align="left"
              style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 700 }}
            >
              Supply
            </TableCell>
            <TableCell
              align="center"
              style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 700 }}
            >
              Trade
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredEvents.map((event, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {event.event}
              </TableCell>
              <TableCell align="left">{event.currentOdds}</TableCell>
              <TableCell align="center">
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color:
                      event.changePercent > 0
                        ? "green"
                        : event.changePercent < 0
                        ? "red"
                        : "grey",
                  }}
                >
                  {event.changePercent > 0 ? (
                    <TrendingUpIcon style={{ marginRight: "5px" }} />
                  ) : event.changePercent < 0 ? (
                    <TrendingDownIcon style={{ marginRight: "5px" }} />
                  ) : (
                    <TrendingFlatIcon style={{ marginRight: "5px" }} />
                  )}
                  {event.changePercent.toFixed(2)}%
                </span>
              </TableCell>
              <TableCell align="left">{formatCurrency(event.volume)}</TableCell>
              <TableCell align="left">{formatCurrency(event.supply)}</TableCell>
              <TableCell align="center">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ShowChartIcon />}
                  onClick={() => handleTrade(event)}
                  style={{
                    borderRadius: "20px",
                    backgroundColor: "#99ccff",
                    color: "#5d5d5d",
                  }}
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
