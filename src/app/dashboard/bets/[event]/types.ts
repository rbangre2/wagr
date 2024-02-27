export type Params = {
  params: { eventId: string };
};

export interface SellOrder {
  user: string;
  minOdds: number;
  amount: number;
}

export interface BuyOrder {
  user: string;
  maxOdds: number;
  amount: number;
}
