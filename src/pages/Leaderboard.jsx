import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  Trophy, 
  Medal, 
  TrendingUp, 
  Users,
  Crown,
  Star,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Leaderboard() {
  const { data: trades = [], isLoading } = useQuery({
    queryKey: ['leaderboard-trades'],
    queryFn: () => base44.entities.Trade.list('-created_date', 100),
  });

  // Aggregate trades by user
  const userStats = trades.reduce((acc, trade) => {
    const user = trade.created_by || 'Anonymous';
    if (!acc[user]) {
      acc[user] = { email: user, volume: 0, trades: 0, profit: 0 };
    }
    acc[user].volume += trade.total || 0;
    acc[user].trades += 1;
    // Simulate profit (random for demo)
    acc[user].profit += (Math.random() - 0.3) * (trade.total || 0);
    return acc;
  }, {});

  const leaderboard = Object.values(userStats)
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 20);

  const topTraders = leaderboard.slice(0, 3);

  const getInitials = (email) => {
    return email?.split('@')[0]?.slice(0, 2)?.toUpperCase() || '??';
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 0:
        return <Crown className="h-5 w-5 text-yellow-400" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankBg = (rank) => {
    switch (rank) {
      case 0:
        return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-yellow-500/30';
      case 1:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-500/10 border-gray-500/30';
      case 2:
        return 'bg-gradient-to-r from-amber-600/20 to-amber-700/10 border-amber-600/30';
      default:
        return 'bg-zinc-900/80 border-zinc-800';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex p-3 bg-purple-500/20 rounded-2xl mb-4">
            <Trophy className="h-8 w-8 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Leaderboard</h1>
          <p className="text-zinc-400">Top traders by volume</p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-20">
            <Users className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400">No traders yet. Be the first!</p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            <div className="grid grid-cols-3 gap-4 mb-12">
              {/* Second Place */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="pt-8"
              >
                {topTraders[1] && (
                  <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 text-center">
                    <div className="relative inline-block mb-3">
                      <Avatar className="h-16 w-16 border-2 border-gray-400">
                        <AvatarFallback className="bg-gray-500/20 text-gray-400 text-lg">
                          {getInitials(topTraders[1].email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-1 -right-1 bg-gray-500 rounded-full p-1">
                        <span className="text-xs font-bold text-white">2</span>
                      </div>
                    </div>
                    <p className="text-white font-medium text-sm truncate mb-1">
                      {topTraders[1].email?.split('@')[0]}
                    </p>
                    <p className="text-lg font-bold text-white">${topTraders[1].volume.toFixed(0)}</p>
                    <p className="text-xs text-zinc-500">{topTraders[1].trades} trades</p>
                  </div>
                )}
              </motion.div>

              {/* First Place */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {topTraders[0] && (
                  <div className="bg-gradient-to-b from-yellow-500/20 to-zinc-900 border border-yellow-500/30 rounded-2xl p-4 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl" />
                    <Crown className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                    <div className="relative inline-block mb-3">
                      <Avatar className="h-20 w-20 border-2 border-yellow-400">
                        <AvatarFallback className="bg-yellow-500/20 text-yellow-400 text-xl">
                          {getInitials(topTraders[0].email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1.5">
                        <Star className="h-3 w-3 text-white fill-white" />
                      </div>
                    </div>
                    <p className="text-white font-medium truncate mb-1">
                      {topTraders[0].email?.split('@')[0]}
                    </p>
                    <p className="text-2xl font-bold text-white">${topTraders[0].volume.toFixed(0)}</p>
                    <p className="text-xs text-zinc-500">{topTraders[0].trades} trades</p>
                  </div>
                )}
              </motion.div>

              {/* Third Place */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-12"
              >
                {topTraders[2] && (
                  <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 text-center">
                    <div className="relative inline-block mb-3">
                      <Avatar className="h-14 w-14 border-2 border-amber-600">
                        <AvatarFallback className="bg-amber-600/20 text-amber-600 text-lg">
                          {getInitials(topTraders[2].email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-1 -right-1 bg-amber-600 rounded-full p-1">
                        <span className="text-xs font-bold text-white">3</span>
                      </div>
                    </div>
                    <p className="text-white font-medium text-sm truncate mb-1">
                      {topTraders[2].email?.split('@')[0]}
                    </p>
                    <p className="text-lg font-bold text-white">${topTraders[2].volume.toFixed(0)}</p>
                    <p className="text-xs text-zinc-500">{topTraders[2].trades} trades</p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Full Leaderboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-zinc-800">
                <h2 className="font-semibold text-white">All Traders</h2>
              </div>
              <div className="divide-y divide-zinc-800">
                {leaderboard.map((trader, index) => (
                  <motion.div
                    key={trader.email}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.03 }}
                    className={`flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors ${
                      index < 3 ? getRankBg(index) : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 text-center">
                        {index < 3 ? (
                          getRankIcon(index)
                        ) : (
                          <span className="text-zinc-500 font-mono">{index + 1}</span>
                        )}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-purple-500/20 text-purple-400">
                          {getInitials(trader.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-medium">{trader.email?.split('@')[0]}</p>
                        <p className="text-xs text-zinc-500">{trader.trades} trades</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">${trader.volume.toFixed(0)}</p>
                      <p className={`text-xs ${trader.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {trader.profit >= 0 ? '+' : ''}{trader.profit.toFixed(0)} P&L
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}