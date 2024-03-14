mod matching_engine;
use matching_engine::engine::{MatchingEngine, TradingPair};
use matching_engine::orderbook::{BidOrAsk, Order};
use rust_decimal_macros::dec;

fn main() {
    let mut engine = MatchingEngine::new();
    let pair = TradingPair::new("ARS".to_string(), "CHL".to_string());
    engine.add_new_market(pair.clone());

    let buy_order = Order::new(BidOrAsk::Bid, 6.5);
    engine.place_limit_order(pair, dec!(10), buy_order).unwrap();
}
