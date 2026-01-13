import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Flame, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FeaturedMarket({ market }) {
  const yesProb = market.yes_probability || 50;
  const noProb = 100 - yesProb;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/50 via-zinc-900 to-zinc-900 border border-purple-500/20"
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      
      <div className="relative p-8 md:p-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
              <Flame className="h-3 w-3 mr-1" />
              Featured
            </Badge>
            <Badge variant="outline" className="border-purple-500/50 text-purple-300 capitalize">
              {market.category}
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-zinc-400 text-sm">Volume</p>
            <p className="text-white font-bold text-lg">${(market.volume || 0).toLocaleString()}</p>
          </div>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
          {market.title}
        </h2>
        
        {market.description && (
          <p className="text-zinc-400 mb-6 line-clamp-2">{market.description}</p>
        )}
        
        {/* Large Probability Display */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Yes</span>
            </div>
            <p className="text-4xl font-bold text-emerald-400">{yesProb}¢</p>
          </div>
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingDown className="h-5 w-5 text-rose-400" />
              <span className="text-rose-400 font-semibold">No</span>
            </div>
            <p className="text-4xl font-bold text-rose-400">{noProb}¢</p>
          </div>
        </div>
        
        <Link to={createPageUrl('MarketDetail') + `?id=${market.id}`}>
          <Button className="w-full bg-white text-zinc-900 hover:bg-zinc-200 font-semibold h-12">
            Trade Now
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}