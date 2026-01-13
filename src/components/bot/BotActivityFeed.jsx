import React from 'react';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, Brain, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BotActivityFeed({ messages }) {
  const getMessageIcon = (message) => {
    const content = message.content?.toLowerCase() || '';
    if (content.includes('buy') || content.includes('bought')) {
      return <TrendingUp className="h-4 w-4 text-emerald-400" />;
    } else if (content.includes('sell') || content.includes('sold')) {
      return <TrendingDown className="h-4 w-4 text-rose-400" />;
    } else if (content.includes('analyzing') || content.includes('analysis')) {
      return <Brain className="h-4 w-4 text-purple-400" />;
    } else {
      return <AlertCircle className="h-4 w-4 text-zinc-400" />;
    }
  };

  const getMessageStyle = (message) => {
    const content = message.content?.toLowerCase() || '';
    if (content.includes('buy') || content.includes('bought')) {
      return 'border-emerald-500/30 bg-emerald-500/10';
    } else if (content.includes('sell') || content.includes('sold')) {
      return 'border-rose-500/30 bg-rose-500/10';
    } else if (content.includes('analyzing') || content.includes('analysis')) {
      return 'border-purple-500/30 bg-purple-500/10';
    } else {
      return 'border-zinc-700 bg-zinc-800/50';
    }
  };

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {messages.map((message, index) => (
          <motion.div
            key={message.id || index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`flex items-start gap-3 p-4 rounded-xl border ${getMessageStyle(message)}`}
          >
            <div className="mt-0.5">
              {getMessageIcon(message)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
              {message.created_date && (
                <p className="text-xs text-zinc-600 mt-2">
                  {format(new Date(message.created_date), 'MMM d, h:mm:ss a')}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}