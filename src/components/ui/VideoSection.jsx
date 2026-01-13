import React, { useState } from 'react';
import { Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative">
      <div className="bg-gradient-to-br from-purple-900/30 to-zinc-900 border border-purple-500/20 rounded-3xl overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Learn How Prediction Markets Work
              </h2>
              <p className="text-zinc-400 text-lg mb-6">
                Discover how to trade on event outcomes and profit from your knowledge. 
                Our quick tutorial will get you started in minutes.
              </p>
              <button
                onClick={() => setIsPlaying(true)}
                className="inline-flex items-center gap-3 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-semibold transition-all group"
              >
                <div className="bg-white/20 rounded-full p-2 group-hover:scale-110 transition-transform">
                  <Play className="h-5 w-5 fill-white" />
                </div>
                Watch Tutorial
              </button>
            </div>
            
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-800 group cursor-pointer" onClick={() => setIsPlaying(true)}>
              <img 
                src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop"
                alt="Trading Tutorial"
                className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-purple-600 rounded-full p-5 shadow-2xl shadow-purple-500/50"
                >
                  <Play className="h-10 w-10 text-white fill-white" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setIsPlaying(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsPlaying(false)}
                className="absolute -top-12 right-0 text-white hover:text-zinc-300 transition-colors"
              >
                <X className="h-8 w-8" />
              </button>
              <iframe
                className="w-full h-full rounded-2xl"
                src="https://www.youtube.com/embed/Oi9ulNNAsmQ?autoplay=1"
                title="Prediction Markets Explained"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}