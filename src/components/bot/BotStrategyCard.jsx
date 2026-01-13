import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function BotStrategyCard({ strategy, selected, onSelect }) {
  const { id, name, icon: Icon, description, riskLevel, features } = strategy;
  
  const riskColors = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-red-400'
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(id)}
      className={`relative w-full text-left p-6 rounded-2xl border-2 transition-all ${
        selected 
          ? 'border-purple-500 bg-purple-500/10' 
          : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
      }`}
    >
      {selected && (
        <div className="absolute top-4 right-4 bg-purple-500 rounded-full p-1">
          <Check className="h-4 w-4 text-white" />
        </div>
      )}
      
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 rounded-xl ${
          selected ? 'bg-purple-500/20' : 'bg-zinc-800'
        }`}>
          <Icon className={`h-6 w-6 ${selected ? 'text-purple-400' : 'text-zinc-400'}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">{name}</h3>
          <p className="text-sm text-zinc-400">{description}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-zinc-500">Risk Level</span>
        <span className={`text-sm font-medium ${riskColors[riskLevel]}`}>
          {riskLevel.toUpperCase()}
        </span>
      </div>
      
      <div className="space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2 text-xs text-zinc-500">
            <div className="w-1 h-1 rounded-full bg-zinc-600" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </motion.button>
  );
}