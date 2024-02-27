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
