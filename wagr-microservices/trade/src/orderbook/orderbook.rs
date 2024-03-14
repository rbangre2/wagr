#![allow(dead_code)]
use super::limit::Limit;
use super::order::BidOrAsk;
use super::order::Order;
use rust_decimal::Decimal;
use std::collections::HashMap;

#[derive(Debug)]
pub struct OrderBook {
    asks: HashMap<Decimal, Limit>,
    bids: HashMap<Decimal, Limit>,
}

impl OrderBook {
    pub fn new() -> OrderBook {
        OrderBook {
            asks: HashMap::new(),
            bids: HashMap::new(),
        }
    }

    pub fn ask_limits(&mut self) -> Vec<&mut Limit> {
        let mut limits = self.asks.values_mut().collect::<Vec<&mut Limit>>();

        limits.sort_by(|a, b| a.price.cmp(&b.price));

        limits
    }

    pub fn bid_limits(&mut self) -> Vec<&mut Limit> {
        let mut limits = self.bids.values_mut().collect::<Vec<&mut Limit>>();

        limits.sort_by(|a, b| b.price.cmp(&a.price));

        limits
    }

    pub fn fill_market_order(&mut self, market_order: &mut Order) {
        let limits = match market_order.bid_or_ask {
            BidOrAsk::Bid => self.ask_limits(),
            BidOrAsk::Ask => self.bid_limits(),
        };

        for limit_order in limits {
            limit_order.fill_order(market_order);

            if market_order.is_filled() {
                break;
            }
        }
        match market_order.bid_or_ask {
            BidOrAsk::Bid => {}
            BidOrAsk::Ask => {}
        }
    }

    pub fn add_limit_order(&mut self, price: Decimal, order: Order) {
        match order.bid_or_ask {
            BidOrAsk::Bid => {
                let limit = self.bids.get_mut(&price);

                match self.bids.get_mut(&price) {
                    Some(limit) => {
                        limit.add_order(order);
                    }
                    None => {
                        let mut limit = Limit::new(price);
                        limit.add_order(order);
                        self.bids.insert(price, limit);
                    }
                }
            }
            BidOrAsk::Ask => match self.asks.get_mut(&price) {
                Some(limit) => limit.add_order(order),
                None => {
                    let mut limit = Limit::new(price);
                    limit.add_order(order);
                    self.asks.insert(price, limit);
                }
            },
        }
    }
}

// TESTS
#[cfg(test)]
pub mod tests {
    use super::*;
    use rust_decimal_macros::dec;

    #[test]
    fn orderbook_fill_market_order_asks() {
        let mut orderbook = OrderBook::new();
        orderbook.add_limit_order(dec!(500), Order::new(BidOrAsk::Ask, 10.0));
        orderbook.add_limit_order(dec!(100), Order::new(BidOrAsk::Ask, 10.0));
        orderbook.add_limit_order(dec!(200), Order::new(BidOrAsk::Ask, 10.0));
        orderbook.add_limit_order(dec!(300), Order::new(BidOrAsk::Ask, 10.0));

        let mut market_order = Order::new(BidOrAsk::Bid, 10.0);
        orderbook.fill_market_order(&mut market_order);

        let ask_limits = orderbook.ask_limits();
        let matched_limit = ask_limits.get(0).unwrap();

        assert_eq!(matched_limit.price, dec!(100));
        assert_eq!(market_order.is_filled(), true);

        let matched_order = matched_limit.orders.get(0).unwrap();
        assert_eq!(matched_order.is_filled(), true);
    }
}
