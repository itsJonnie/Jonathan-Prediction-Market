import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, TrendingUp, Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function AISuggestions({ onSelectSuggestion }) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [customPrompt, setCustomPrompt] = useState('');

  const generateSuggestions = async (prompt = '') => {
    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate 3 interesting prediction market ideas${prompt ? ` related to: ${prompt}` : ' based on current trending topics'}. 
        
For each market, provide:
- A clear yes/no question as the title
- A detailed description
- Suggested category (sports, technology, or entertainment)
- Resolution criteria
- A reasonable end date in 2026 (format: YYYY-MM-DD)
- Initial probability estimate (0-100)

Make them specific, time-bound, and objectively resolvable. Focus on 2026 events only.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            markets: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  category: { type: "string" },
                  resolution_criteria: { type: "string" },
                  end_date: { type: "string" },
                  yes_probability: { type: "number" }
                }
              }
            }
          }
        }
      });

      setSuggestions(response.markets || []);
      if (response.markets?.length === 0) {
        toast.error('No suggestions generated. Try again!');
      }
    } catch (error) {
      toast.error('Failed to generate suggestions');
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Input
          placeholder="Enter a topic or leave blank for trending markets..."
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && generateSuggestions(customPrompt)}
          className="bg-zinc-800 border-zinc-700 text-white"
        />
        <Button
          onClick={() => generateSuggestions(customPrompt)}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              {suggestions.length > 0 ? 'Refresh' : 'Generate'}
            </>
          )}
        </Button>
      </div>

      <AnimatePresence>
        {suggestions.length > 0 && (
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 hover:border-purple-500/50 transition-colors cursor-pointer"
                onClick={() => onSelectSuggestion(suggestion)}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg flex-shrink-0">
                    <TrendingUp className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1">{suggestion.title}</h4>
                    <p className="text-zinc-400 text-sm mb-2 line-clamp-2">{suggestion.description}</p>
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span className="capitalize">{suggestion.category}</span>
                      <span>•</span>
                      <span>{suggestion.end_date}</span>
                      <span>•</span>
                      <span className="text-purple-400">{suggestion.yes_probability}% initial</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}