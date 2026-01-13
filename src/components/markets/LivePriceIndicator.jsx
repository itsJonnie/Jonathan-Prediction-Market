import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

export default function LivePriceIndicator({ currentPrice, previousPrice }) {
  const [direction, setDirection] = useState(null);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    if (previousPrice !== undefined && currentPrice !== previousPrice) {
      setDirection(currentPrice > previousPrice ? 'up' : 'down');
      setShowPulse(true);
      
      const timer = setTimeout(() => {
        setDirection(null);
        setShowPulse(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [currentPrice, previousPrice]);

  return (
    <div className="inline-flex items-center gap-1">
      <AnimatePresence>
        {showPulse && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="relative"
          >
            {direction === 'up' ? (
              <TrendingUp className="h-3 w-3 text-emerald-400" />
            ) : (
              <TrendingDown className="h-3 w-3 text-rose-400" />
            )}
            <motion.div
              className={`absolute inset-0 rounded-full ${
                direction === 'up' ? 'bg-emerald-400' : 'bg-rose-400'
              }`}
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 1 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <Activity className="h-2 w-2 text-emerald-400 animate-pulse" />
    </div>
  );
}