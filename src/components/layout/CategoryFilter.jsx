import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Film, 
  Cpu,
  LayoutGrid
} from 'lucide-react';

const categories = [
  { id: 'all', label: 'All Markets', icon: LayoutGrid },
  { id: 'sports', label: 'Sports', icon: Trophy },
  { id: 'technology', label: 'Technology', icon: Cpu },
  { id: 'entertainment', label: 'Entertainment', icon: Film },
];

export default function CategoryFilter({ selected, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isSelected = selected === cat.id;
        
        return (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
              isSelected
                ? 'bg-purple-600 text-white'
                : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium">{cat.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}