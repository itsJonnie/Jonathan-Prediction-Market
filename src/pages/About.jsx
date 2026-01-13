import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Zap, User } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 bg-green-950/30 border-2 border-green-700 rounded-xl mb-6">
            <User className="h-8 w-8 text-green-500 terminal-glow" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-green-500 terminal-glow mb-4">
            ABOUT PREDICTX
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto" />
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black border-2 border-green-900/50 rounded-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-yellow-500 gold-glow mb-4 flex items-center gap-2">
            <Target className="h-6 w-6" />
            THE VISION
          </h2>
          <p className="text-green-400 text-lg leading-relaxed mb-4">
            My name is <span className="text-yellow-500 font-bold">Jonathan</span>, and I was inspired by platforms like{' '}
            <span className="text-green-500 font-bold">Polymarket</span> and{' '}
            <span className="text-green-500 font-bold">Kalshi</span> to build my own prediction market.
          </p>
          <p className="text-green-400 text-lg leading-relaxed">
            I believe prediction markets are the future of information aggregation and forecasting. 
            PredictX is my vision of creating a transparent, accessible platform where anyone can 
            harness the power of collective intelligence to predict real-world outcomes.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black border-2 border-green-900/50 rounded-xl p-6"
          >
            <div className="p-2 bg-green-950/30 border-2 border-green-700 rounded-lg w-fit mb-4">
              <TrendingUp className="h-6 w-6 text-green-500 terminal-glow" />
            </div>
            <h3 className="text-xl font-bold text-yellow-500 mb-2">TRANSPARENT</h3>
            <p className="text-green-400">
              Real-time market data and order books visible to everyone.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-black border-2 border-green-900/50 rounded-xl p-6"
          >
            <div className="p-2 bg-green-950/30 border-2 border-green-700 rounded-lg w-fit mb-4">
              <Zap className="h-6 w-6 text-yellow-500 gold-glow" />
            </div>
            <h3 className="text-xl font-bold text-yellow-500 mb-2">FAST</h3>
            <p className="text-green-400">
              Lightning-fast trading execution and live market updates.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black border-2 border-green-900/50 rounded-xl p-6"
          >
            <div className="p-2 bg-green-950/30 border-2 border-green-700 rounded-lg w-fit mb-4">
              <Target className="h-6 w-6 text-green-500 terminal-glow" />
            </div>
            <h3 className="text-xl font-bold text-yellow-500 mb-2">ACCURATE</h3>
            <p className="text-green-400">
              Markets that aggregate wisdom and reveal true probabilities.
            </p>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-green-950/30 via-green-900/30 to-green-950/30 border-2 border-green-700 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-yellow-500 gold-glow mb-4">
              JOIN THE REVOLUTION
            </h3>
            <p className="text-green-400 text-lg mb-6">
              Start predicting, trading, and profiting from your knowledge today.
            </p>
            <a
              href="/Home"
              className="inline-block bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-bold px-8 py-3 border-2 border-yellow-400 tracking-wider transition-all"
            >
              EXPLORE MARKETS
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}