use super::order::BidOrAsk;
use super::order::Order;
use super::orderbook::OrderBook;
use rust_decimal::Decimal;

#[derive(Debug)]
pub struct Limit {
    pub price: Decimal,
    pub orders: Vec<Order>,
}

impl Limit {
    pub fn new(price: Decimal) -> Limit {
        Limit {
            price,
            orders: Vec::new(),
        }
    }

    pub fn total_volume(&self) -> f64 {
        self.orders
            .iter()
            .map(|order| order.size)
            .reduce(|a, b| a + b)
            .unwrap()
    }

    pub fn fill_order(&mut self, market_order: &mut Order) {
        for limit_order in self.orders.iter_mut() {
            match market_order.size >= limit_order.size {
                true => {
                    market_order.size -= limit_order.size;
                    limit_order.size = 0.0;
                }
                false => {
                    limit_order.size -= market_order.size;
                    market_order.size = 0.0
                }
            }

            if market_order.is_filled() {
                break;
            }
        }
    }

    pub fn add_order(&mut self, order: Order) {
        self.orders.push(order);
    }
}

// TESTS
#[cfg(test)]
pub mod tests {
    use super::*;
    use rust_decimal_macros::dec;

    #[test]
    fn limit_order_single_fill() {
        let price = dec!(10000);
        let mut limit = Limit::new(price);

        let buy_limit_order = Order::new(BidOrAsk::Bid, 100.0);
        limit.add_order(buy_limit_order);

        let mut market_sell_order = Order::new(BidOrAsk::Ask, 99.0);
        limit.fill_order(&mut market_sell_order);

        assert_eq!(market_sell_order.is_filled(), true);
        assert_eq!(limit.orders.get(0).unwrap().size, 1.0);

        println!("{:?}", limit);
    }

    #[test]
    fn limit_order_multi_fill() {
        let price = dec!(10000);
        let mut limit = Limit::new(price);

        let buy_limit_order_1 = Order::new(BidOrAsk::Bid, 100.0);
        let buy_limit_order_2 = Order::new(BidOrAsk::Bid, 100.0);
        limit.add_order(buy_limit_order_1);
        limit.add_order(buy_limit_order_2);

        let mut market_sell_order = Order::new(BidOrAsk::Ask, 199.0);
        limit.fill_order(&mut market_sell_order);

        assert_eq!(market_sell_order.is_filled(), true);
        assert_eq!(limit.orders.get(0).unwrap().is_filled(), true);
        assert_eq!(limit.orders.get(1).unwrap().is_filled(), false);
        assert_eq!(limit.orders.get(1).unwrap().size, 1.0);

        println!("{:?}", limit);
    }

    #[test]
    fn limit_total_volume() {
        let price = dec!(10000);
        let mut limit = Limit::new(price);

        let buy_limit_order_1 = Order::new(BidOrAsk::Bid, 100.0);
        let buy_limit_order_2 = Order::new(BidOrAsk::Bid, 100.0);

        limit.add_order(buy_limit_order_1);
        limit.add_order(buy_limit_order_2);

        assert_eq!(limit.total_volume(), 200.0);
    }

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
