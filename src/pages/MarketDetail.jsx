import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  Share2,
  Bookmark,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import TradingPanel from '@/components/markets/TradingPanel';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

const categoryColors = {
  sports: "bg-green-500/20 text-green-400 border-green-500/30",
  technology: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  entertainment: "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

// Generate mock price history
const generatePriceHistory = (currentProb) => {
  const data = [];
  let prob = 50;
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    prob = Math.max(5, Math.min(95, prob + (Math.random() - 0.5) * 10));
    if (i === 0) prob = currentProb;
    data.push({
      date: format(date, 'MMM d'),
      probability: Math.round(prob),
    });
  }
  return data;
};

export default function MarketDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const marketId = urlParams.get('id');

  const { data: market, isLoading } = useQuery({
    queryKey: ['market', marketId],
    queryFn: async () => {
      const markets = await base44.entities.Market.filter({ id: marketId });
      return markets[0];
    },
    enabled: !!marketId,
    refetchInterval: 2000, // Live market updates
  });

  const { data: trades = [] } = useQuery({
    queryKey: ['trades', marketId],
    queryFn: () => base44.entities.Trade.filter({ market_id: marketId }, '-created_date', 10),
    enabled: !!marketId,
    refetchInterval: 1500, // Live trade feed
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!market) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">Market not found</p>
          <Link to={createPageUrl('Home')}>
            <Button variant="outline">Go Back</Button>
          </Link>
        </div>
      </div>
    );
  }

  const priceHistory = generatePriceHistory(market.yes_probability);
  const yesProb = market.yes_probability || 50;
  const noProb = 100 - yesProb;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link to={createPageUrl('Home')}>
          <Button variant="ghost" className="text-zinc-400 hover:text-white mb-6 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Markets
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Market Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm"
            >
              <div className="flex items-start gap-4 mb-6">
                {market.image_url && (
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-800">
                    <img 
                      src={market.image_url} 
                      alt={market.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={`${categoryColors[market.category]} border text-xs capitalize`}>
                      {market.category}
                    </Badge>
                    {market.status === 'active' && (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-0">Active</Badge>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-2">{market.title}</h1>
                  {market.description && (
                    <p className="text-zinc-400">{market.description}</p>
                  )}
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-zinc-800/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
                    <DollarSign className="h-4 w-4" />
                    Volume
                  </div>
                  <p className="text-xl font-bold text-white">${(market.volume || 0).toLocaleString()}</p>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
                    <Clock className="h-4 w-4" />
                    Ends
                  </div>
                  <p className="text-xl font-bold text-white">{format(new Date(market.end_date), 'MMM d, yyyy')}</p>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
                    <Users className="h-4 w-4" />
                    Trades
                  </div>
                  <p className="text-xl font-bold text-white">{trades.length}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleShare} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Watchlist
                </Button>
              </div>
            </motion.div>

            {/* Price Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm"
            >
              <h2 className="text-lg font-semibold text-white mb-4">Price History</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={priceHistory}>
                    <defs>
                      <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      stroke="#52525b" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      stroke="#52525b" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#18181b',
                        border: '1px solid #3f3f46',
                        borderRadius: '12px',
                        color: '#fff',
                      }}
                      labelStyle={{ color: '#a1a1aa' }}
                      formatter={(value) => [`${value}%`, 'Yes Probability']}
                    />
                    <Area
                      type="monotone"
                      dataKey="probability"
                      stroke="#a855f7"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorProb)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm"
            >
              <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
              {trades.length === 0 ? (
                <p className="text-zinc-500 text-center py-8">No trades yet. Be the first!</p>
              ) : (
                <div className="space-y-3">
                  {trades.map((trade, index) => (
                    <div key={trade.id} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          trade.side === 'yes' 
                            ? 'bg-emerald-500/20' 
                            : 'bg-rose-500/20'
                        }`}>
                          {trade.side === 'yes' 
                            ? <TrendingUp className="h-4 w-4 text-emerald-400" />
                            : <TrendingDown className="h-4 w-4 text-rose-400" />
                          }
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">
                            {trade.action === 'buy' ? 'Bought' : 'Sold'} {trade.shares.toFixed(2)} shares
                          </p>
                          <p className="text-zinc-500 text-xs">
                            {format(new Date(trade.created_date), 'MMM d, h:mm a')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          trade.side === 'yes' ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {trade.side.toUpperCase()} @ {trade.price}¢
                        </p>
                        <p className="text-zinc-500 text-xs">${trade.total?.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar - Trading Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <TradingPanel market={market} />
              </motion.div>

              {/* Current Odds */}
              <div className="mt-6 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 backdrop-blur-sm">
                <h3 className="text-sm font-medium text-zinc-400 mb-4">Current Odds</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                      <span className="text-white">Yes</span>
                    </div>
                    <span className="text-2xl font-bold text-emerald-400">{yesProb}%</span>
                  </div>
                  <div className="h-3 bg-zinc-800 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full transition-all duration-500"
                      style={{ width: `${yesProb}%` }}
                    />
                    <div 
                      className="bg-gradient-to-r from-rose-400 to-rose-500 h-full transition-all duration-500"
                      style={{ width: `${noProb}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-400" />
                      <span className="text-white">No</span>
                    </div>
                    <span className="text-2xl font-bold text-rose-400">{noProb}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}