"use client";
import React from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import OrderBook from "@/components/OrderBook/OrderBook";
import { Params } from "./types";

type EventOddsData = {
  date: string;
  odds: number;
};

const mockOddsData: EventOddsData[] = [
  // Mock data representing the last 7 days of odds movement
  // Replace this with your actual data fetching logic
  { date: "2024-02-20", odds: 2.5 },
  { date: "2024-02-21", odds: 2.7 },
  { date: "2024-02-22", odds: 2.6 },
  { date: "2024-02-23", odds: 2.8 },
  { date: "2024-02-24", odds: 2.9 },
  { date: "2024-02-25", odds: 3.0 },
  { date: "2024-02-26", odds: 2.9 },
];

const mockSellOrders: SellOrder[] = [
  { user: "User1", minOdds: 1.5, amount: 100 },
  { user: "User2", minOdds: 2.0, amount: 200 },
  { user: "User3", minOdds: 1.8, amount: 150 },
];

// Mock data for buy orders
const mockBuyOrders: BuyOrder[] = [
  { user: "User4", maxOdds: 1.6, amount: 120 },
  { user: "User5", maxOdds: 2.1, amount: 250 },
  { user: "User6", maxOdds: 1.9, amount: 175 },
];

export default function TradeEvent({ params }: Params) {
  const handleSellOrder = (order: SellOrder) => {
    console.log("Sell order placed:", order);
  };

  const handleBuyOrder = (order: BuyOrder) => {
    console.log("Buy order placed:", order);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // Centers children horizontally
        width: "100%", // Ensures the Box takes full width
      }}
    >
      <Typography variant="h4" component="h2" sx={{ margin: "20px 0" }}>
        Trade Event
      </Typography>
      <LineChart
        width={730}
        height={250}
        data={mockOddsData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="odds" stroke="#8884d8" />
      </LineChart>
      <Box sx={{ width: "100%", marginTop: "20px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center", // This will center the buttons if they are not full width
            gap: "10px", // Adds space between buttons
          }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{ marginBottom: "10px" }}
          >
            Place Buy Order
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{ marginBottom: "10px" }}
          >
            Place Sell Order
          </Button>
        </Box>
        <OrderBook
          sellOrders={mockSellOrders}
          buyOrders={mockBuyOrders}
          onSellOrder={handleSellOrder}
          onBuyOrder={handleBuyOrder}
        />
      </Box>
    </Box>
  );
}
