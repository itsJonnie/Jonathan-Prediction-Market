import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, DollarSign, Flame, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import LivePriceIndicator from './LivePriceIndicator';

const categoryColors = {
  sports: "bg-green-500/20 text-green-400 border-green-500/30",
  technology: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  entertainment: "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

export default function MarketCard({ market, index = 0 }) {
  const previousPriceRef = useRef();
  
  // Get best bid/ask from order book with live updates
  const { data: buyOrders = [] } = useQuery({
    queryKey: ['market-bids', market.id],
    queryFn: () => base44.entities.Order.filter({
      market_id: market.id,
      side: 'yes',
      action: 'buy',
      status: 'open'
    }),
    refetchInterval: 2000, // Live price updates
  });

  const { data: sellOrders = [] } = useQuery({
    queryKey: ['market-asks', market.id],
    queryFn: () => base44.entities.Order.filter({
      market_id: market.id,
      side: 'yes',
      action: 'sell',
      status: 'open'
    }),
    refetchInterval: 2000, // Live price updates
  });

  const bestBid = Math.max(...buyOrders.map(o => o.price), 0);
  const bestAsk = Math.min(...sellOrders.map(o => o.price), 100);
  const midPrice = buyOrders.length > 0 || sellOrders.length > 0 
    ? Math.round((bestBid + bestAsk) / 2) 
    : market.yes_probability || 50;
  
  const yesProb = midPrice;
  const noProb = 100 - yesProb;

  useEffect(() => {
    previousPriceRef.current = yesProb;
  }, [yesProb]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={createPageUrl('MarketDetail') + `?id=${market.id}`}>
        <div className="group relative bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-600 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5 backdrop-blur-sm">
          {market.is_trending && (
            <div className="absolute -top-2 -right-2">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-1.5 shadow-lg">
                <Flame className="h-3 w-3 text-white" />
              </div>
            </div>
          )}
          
          <div className="flex items-start gap-4">
            {market.image_url && (
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-800">
                <img 
                  src={market.image_url} 
                  alt={market.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className={`${categoryColors[market.category]} border text-xs capitalize`}>
                  {market.category}
                </Badge>
              </div>
              
              <h3 className="font-semibold text-white text-sm leading-tight mb-3 group-hover:text-purple-300 transition-colors line-clamp-2">
                {market.title}
              </h3>
              
              {/* Probability Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <LivePriceIndicator currentPrice={yesProb} previousPrice={previousPriceRef.current} />
                    Yes {yesProb}¢ {bestBid > 0 && <span className="text-zinc-600">({bestBid}↔{bestAsk})</span>}
                  </span>
                  <span className="text-rose-400 font-medium">No {noProb}¢</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden flex">
                  <motion.div 
                    className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${yesProb}%` }}
                    transition={{ duration: 0.8, delay: index * 0.05 }}
                  />
                  <motion.div 
                    className="bg-gradient-to-r from-rose-400 to-rose-500 h-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${noProb}%` }}
                    transition={{ duration: 0.8, delay: index * 0.05 }}
                  />
                </div>
              </div>
              
              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  <span>${(market.volume || 0).toLocaleString()} Vol</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{format(new Date(market.end_date), 'MMM d, yyyy')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}