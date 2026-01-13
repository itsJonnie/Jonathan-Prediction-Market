import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderBook({ marketId, side }) {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', marketId, side],
    queryFn: () => base44.entities.Order.filter({
      market_id: marketId,
      side: side,
      status: 'open'
    }),
    refetchInterval: 1000, // Refresh every 1 second for live updates
  });

  // Separate buy and sell orders
  const buyOrders = orders.filter(o => o.action === 'buy').sort((a, b) => b.price - a.price);
  const sellOrders = orders.filter(o => o.action === 'sell').sort((a, b) => a.price - b.price);

  const bestBid = buyOrders[0]?.price || 0;
  const bestAsk = sellOrders[0]?.price || 100;
  const spread = bestAsk - bestBid;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Spread Info */}
      <div className="bg-zinc-800/50 rounded-xl p-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-zinc-500">Best Bid</span>
          <span className="text-emerald-400 font-bold">{bestBid}¢</span>
        </div>
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-zinc-500">Best Ask</span>
          <span className="text-rose-400 font-bold">{bestAsk}¢</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500">Spread</span>
          <span className="text-zinc-300 font-medium">{spread.toFixed(1)}¢</span>
        </div>
      </div>

      {/* Sell Orders (Asks) */}
      <div>
        <h4 className="text-xs font-medium text-rose-400 mb-2 flex items-center gap-1">
          <TrendingDown className="h-3 w-3" />
          Sell Orders (Ask)
        </h4>
        <div className="space-y-1">
          {sellOrders.length === 0 ? (
            <p className="text-xs text-zinc-600 text-center py-2">No sell orders</p>
          ) : (
            sellOrders.slice(0, 5).map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between bg-rose-500/5 border border-rose-500/20 rounded-lg px-3 py-1.5"
              >
                <span className="text-rose-400 font-mono text-sm">{order.price}¢</span>
                <span className="text-zinc-400 text-xs">{(order.quantity - order.filled_quantity).toFixed(2)}</span>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Buy Orders (Bids) */}
      <div>
        <h4 className="text-xs font-medium text-emerald-400 mb-2 flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          Buy Orders (Bid)
        </h4>
        <div className="space-y-1">
          {buyOrders.length === 0 ? (
            <p className="text-xs text-zinc-600 text-center py-2">No buy orders</p>
          ) : (
            buyOrders.slice(0, 5).map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-3 py-1.5"
              >
                <span className="text-emerald-400 font-mono text-sm">{order.price}¢</span>
                <span className="text-zinc-400 text-xs">{(order.quantity - order.filled_quantity).toFixed(2)}</span>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}