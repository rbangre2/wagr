mod matching_engine; 
use matching_engine::orderbook::{ BidOrAsk, Order, OrderBook };
use matching_engine::engine::{ MatchingEngine, TradingPair }; 

fn main() {
    let mut engine = MatchingEngine::new();
    let pair = TradingPair::new("ARS".to_string(), "CHL".to_string());
    engine.add_new_market(pair.clone());

    let buy_order = Order::new(BidOrAsk::Bid, 6.5);
    let pair2 = TradingPair::new("MCY".to_string(), "MNU".to_string()); 
    engine.place_limit_order(pair, 10.000, buy_order).unwrap(); 
}
