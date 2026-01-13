import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PositionCard({ position, index = 0 }) {
  const isYes = position.side === 'yes';
  const profitLoss = ((position.current_value || 0) - (position.shares * position.avg_price / 100)).toFixed(2);
  const isProfitable = profitLoss >= 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={createPageUrl('MarketDetail') + `?id=${position.market_id}`}>
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 hover:border-zinc-600 transition-all group">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0 mr-4">
              <p className="text-white font-medium text-sm line-clamp-2 group-hover:text-purple-300 transition-colors">
                {position.market_title}
              </p>
            </div>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
              isYes 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : 'bg-rose-500/20 text-rose-400'
            }`}>
              {isYes ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {position.side.toUpperCase()}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-zinc-500 text-xs mb-0.5">Shares</p>
              <p className="text-white font-medium">{position.shares?.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-zinc-500 text-xs mb-0.5">Avg Price</p>
              <p className="text-white font-medium">{position.avg_price}¢</p>
            </div>
            <div>
              <p className="text-zinc-500 text-xs mb-0.5">P&L</p>
              <p className={`font-medium ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isProfitable ? '+' : ''}{profitLoss}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}