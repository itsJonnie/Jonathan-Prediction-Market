import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Search, TrendingUp, Flame, ArrowRight, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { motion } from 'framer-motion';
import MarketCard from '@/components/markets/MarketCard';
import FeaturedMarket from '@/components/markets/FeaturedMarket';
import CategoryFilter from '@/components/layout/CategoryFilter';
import VideoSection from '@/components/ui/VideoSection';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: markets = [], isLoading } = useQuery({
    queryKey: ['markets'],
    queryFn: () => base44.entities.Market.list('-volume', 50),
    refetchInterval: 3000, // Live market updates every 3 seconds
  });

  const featuredMarket = markets.find(m => m.is_featured);
  
  const filteredMarkets = markets.filter(m => {
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const trendingMarkets = markets.filter(m => m.is_trending).slice(0, 5);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-3xl opacity-30" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Jonathan's Prediction Market <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Predict X</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
              Predict on Sports, Crypto, Futures, Sports & More!
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-xl mx-auto mb-12"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
              <Input
                placeholder="Search markets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-zinc-900/80 border-zinc-800 text-white placeholder:text-zinc-500 rounded-2xl text-lg focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </motion.div>

          {/* Featured Market */}
          {featuredMarket && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <FeaturedMarket market={featuredMarket} />
            </motion.div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Category Filter */}
        <div className="mb-8">
          <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Markets Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-400" />
                {selectedCategory === 'all' ? 'All Markets' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Markets`}
              </h2>
              <span className="text-sm text-zinc-500">{filteredMarkets.length} markets</span>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              </div>
            ) : filteredMarkets.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-zinc-500">No markets found</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {filteredMarkets.map((market, index) => (
                  <MarketCard key={market.id} market={market} index={index} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5">
              <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
                <Flame className="h-4 w-4 text-orange-400" />
                Trending Now
              </h3>
              <div className="space-y-3">
                {trendingMarkets.map((market, index) => (
                  <motion.a
                    key={market.id}
                    href={`/MarketDetail?id=${market.id}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="block group"
                  >
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800 transition-colors">
                      <span className="text-zinc-600 font-mono text-sm w-4">{index + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-zinc-300 group-hover:text-white transition-colors line-clamp-1">
                          {market.title}
                        </p>
                        <p className="text-xs text-emerald-400 font-medium">
                          {market.yes_probability}% Yes
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-purple-400 transition-colors" />
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-br from-purple-900/30 to-zinc-900 border border-purple-500/20 rounded-2xl p-5">
              <h3 className="font-semibold text-white mb-4">Platform Stats</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-zinc-500 text-sm">Total Volume</p>
                  <p className="text-2xl font-bold text-white">
                    ${markets.reduce((sum, m) => sum + (m.volume || 0), 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-500 text-sm">Active Markets</p>
                  <p className="text-2xl font-bold text-white">
                    {markets.filter(m => m.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div className="mt-16">
          <VideoSection />
        </div>
      </section>
    </div>
  );
}