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
