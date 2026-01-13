import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  History,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import PositionCard from '@/components/portfolio/PositionCard';
import { Badge } from "@/components/ui/badge";

export default function Portfolio() {
  const { data: positions = [], isLoading: positionsLoading } = useQuery({
    queryKey: ['positions'],
    queryFn: () => base44.entities.Position.list('-created_date', 50),
    refetchInterval: 3000, // Live position updates
  });

  const { data: trades = [], isLoading: tradesLoading } = useQuery({
    queryKey: ['all-trades'],
    queryFn: () => base44.entities.Trade.list('-created_date', 20),
    refetchInterval: 2000, // Live trade feed
  });

  const totalValue = positions.reduce((sum, p) => sum + (p.current_value || 0), 0);
  const totalInvested = positions.reduce((sum, p) => sum + (p.shares * p.avg_price / 100), 0);
  const totalPnL = totalValue - totalInvested;
  const pnlPercent = totalInvested > 0 ? ((totalPnL / totalInvested) * 100).toFixed(2) : 0;

  const yesPositions = positions.filter(p => p.side === 'yes');
  const noPositions = positions.filter(p => p.side === 'no');

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-xl">
              <Wallet className="h-6 w-6 text-purple-400" />
            </div>
            Portfolio
          </h1>
          <p className="text-zinc-400 mt-2">Track your positions and trading history</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 text-zinc-500 mb-2">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm">Portfolio Value</span>
            </div>
            <p className="text-2xl font-bold text-white">${totalValue.toFixed(2)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 text-zinc-500 mb-2">
              <Wallet className="h-4 w-4" />
              <span className="text-sm">Total Invested</span>
            </div>
            <p className="text-2xl font-bold text-white">${totalInvested.toFixed(2)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 text-zinc-500 mb-2">
              {totalPnL >= 0 ? (
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-rose-400" />
              )}
              <span className="text-sm">Total P&L</span>
            </div>
            <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 text-zinc-500 mb-2">
              {pnlPercent >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-emerald-400" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-rose-400" />
              )}
              <span className="text-sm">Return</span>
            </div>
            <p className={`text-2xl font-bold ${pnlPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {pnlPercent >= 0 ? '+' : ''}{pnlPercent}%
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Positions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Yes Positions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                  Yes Positions
                </h2>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-0">
                  {yesPositions.length} positions
                </Badge>
              </div>
              
              {positionsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                </div>
              ) : yesPositions.length === 0 ? (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 text-center">
                  <TrendingUp className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
                  <p className="text-zinc-500">No YES positions yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {yesPositions.map((position, index) => (
                    <PositionCard key={position.id} position={position} index={index} />
                  ))}
                </div>
              )}
            </motion.div>

            {/* No Positions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-rose-400" />
                  No Positions
                </h2>
                <Badge className="bg-rose-500/20 text-rose-400 border-0">
                  {noPositions.length} positions
                </Badge>
              </div>
              
              {positionsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                </div>
              ) : noPositions.length === 0 ? (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 text-center">
                  <TrendingDown className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
                  <p className="text-zinc-500">No NO positions yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {noPositions.map((position, index) => (
                    <PositionCard key={position.id} position={position} index={index} />
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Trade History */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 sticky top-8"
            >
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <History className="h-5 w-5 text-purple-400" />
                Trade History
              </h2>
              
              {tradesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                </div>
              ) : trades.length === 0 ? (
                <div className="text-center py-8">
                  <History className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
                  <p className="text-zinc-500">No trades yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {trades.map((trade) => (
                    <div key={trade.id} className="p-3 bg-zinc-800/50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {trade.side === 'yes' ? (
                            <div className="p-1.5 bg-emerald-500/20 rounded-lg">
                              <TrendingUp className="h-3 w-3 text-emerald-400" />
                            </div>
                          ) : (
                            <div className="p-1.5 bg-rose-500/20 rounded-lg">
                              <TrendingDown className="h-3 w-3 text-rose-400" />
                            </div>
                          )}
                          <span className={`text-sm font-medium ${
                            trade.side === 'yes' ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            {trade.action.toUpperCase()} {trade.side.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-white font-medium">${trade.total?.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-1 mb-1">{trade.market_title}</p>
                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <span>{trade.shares?.toFixed(2)} shares @ {trade.price}¢</span>
                        <span>{format(new Date(trade.created_date), 'MMM d, h:mm a')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}