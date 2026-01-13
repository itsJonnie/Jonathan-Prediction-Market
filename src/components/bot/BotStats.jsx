import React from 'react';
import { TrendingUp, Activity, DollarSign, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BotStats({ trades, positions }) {
  const botTrades = trades.filter(t => t.created_by?.includes('trading_bot') || t.bot_trade);
  const totalVolume = botTrades.reduce((sum, t) => sum + (t.total || 0), 0);
  const totalTrades = botTrades.length;
  
  // Calculate P&L from bot positions
  const botPositions = positions.filter(p => p.created_by?.includes('trading_bot') || p.bot_position);
  const totalInvested = botPositions.reduce((sum, p) => sum + (p.shares * p.avg_price / 100), 0);
  const currentValue = botPositions.reduce((sum, p) => sum + (p.current_value || 0), 0);
  const profit = currentValue - totalInvested;
  const profitPercent = totalInvested > 0 ? ((profit / totalInvested) * 100) : 0;
  
  const stats = [
    {
      label: 'Total Trades',
      value: totalTrades,
      icon: Activity,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      label: 'Trading Volume',
      value: `$${totalVolume.toFixed(0)}`,
      icon: DollarSign,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      label: 'Active Positions',
      value: botPositions.length,
      icon: Target,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/20'
    },
    {
      label: 'Bot P&L',
      value: `${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}`,
      subValue: `${profitPercent >= 0 ? '+' : ''}${profitPercent.toFixed(1)}%`,
      icon: TrendingUp,
      color: profit >= 0 ? 'text-emerald-400' : 'text-rose-400',
      bgColor: profit >= 0 ? 'bg-emerald-500/20' : 'bg-rose-500/20'
    }
  ];
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-zinc-500">{stat.label}</span>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </div>
          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          {stat.subValue && (
            <p className="text-xs text-zinc-600 mt-1">{stat.subValue}</p>
          )}
        </motion.div>
      ))}
    </div>
  );
}