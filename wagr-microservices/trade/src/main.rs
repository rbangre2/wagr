pub mod matching_engine;
pub mod orderbook;

use crate::matching_engine::trade_pair::TradingPair;
use crate::orderbook::order::BidOrAsk;
use crate::orderbook::order::Order;
use matching_engine::engine::MatchingEngine;
use rust_decimal_macros::dec;

fn main() {
    let mut engine = MatchingEngine::new();
    let pair = TradingPair::new("ARS".to_string(), "CHL".to_string());
    engine.add_new_market(pair.clone());

    let buy_order = Order::new(BidOrAsk::Bid, 6.5);
    engine.place_limit_order(pair, dec!(10), buy_order).unwrap();
}
