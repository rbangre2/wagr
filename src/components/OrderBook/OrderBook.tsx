import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/material";

interface SellOrder {
  user: string;
  minOdds: number;
  amount: number;
}

interface BuyOrder {
  user: string;
  maxOdds: number;
  amount: number;
}

interface OrderBookProps {
  sellOrders: SellOrder[];
  buyOrders: BuyOrder[];
  onSellOrder: (order: SellOrder) => void;
  onBuyOrder: (order: BuyOrder) => void;
}

const OrderBook: React.FC<OrderBookProps> = ({
  sellOrders,
  buyOrders,
  onSellOrder,
  onBuyOrder,
}) => {
  // Function to handle placing a sell order
  const handleSellOrder = (order: SellOrder) => {
    onSellOrder(order);
  };

  // Function to handle placing a buy order
  const handleBuyOrder = (order: BuyOrder) => {
    onBuyOrder(order);
  };

  return (
    <Box display="flex" justifyContent="center" m={1} p={1}>
      <Box p={1}>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell align="right">Min Odds</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sellOrders.map((order, index) => (
                <TableRow
                  key={`sell-${index}`}
                  onClick={() => handleSellOrder(order)}
                >
                  <TableCell>{order.user}</TableCell>
                  <TableCell align="right">{order.minOdds}</TableCell>
                  <TableCell align="right">{order.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
      <Box p={1}>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell align="right">Max Odds</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {buyOrders.map((order, index) => (
                <TableRow
                  key={`buy-${index}`}
                  onClick={() => handleBuyOrder(order)}
                >
                  <TableCell>{order.user}</TableCell>
                  <TableCell align="right">{order.maxOdds}</TableCell>
                  <TableCell align="right">{order.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  );
};

export default OrderBook;
