import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Bot, 
  Play, 
  Pause, 
  RotateCcw, 
  Zap,
  Brain,
  TrendingUp,
  Settings,
  Activity,
  Loader2,
  AlertCircle,
  Target,
  BarChart3
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import BotStrategyCard from '@/components/bot/BotStrategyCard';
import BotActivityFeed from '@/components/bot/BotActivityFeed';
import BotStats from '@/components/bot/BotStats';
import BotConfigPanel from '@/components/bot/BotConfigPanel';

const strategies = [
  {
    id: 'value',
    name: 'Value Trading',
    icon: Target,
    description: 'Find undervalued markets and profit from mispricing',
    riskLevel: 'medium',
    features: ['Fundamental analysis', 'Long-term positions', 'Value-focused']
  },
  {
    id: 'momentum',
    name: 'Momentum Trading',
    icon: TrendingUp,
    description: 'Follow trends and ride probability movements',
    riskLevel: 'high',
    features: ['Trend following', 'Quick execution', 'High turnover']
  },
  {
    id: 'contrarian',
    name: 'Contrarian Strategy',
    icon: RotateCcw,
    description: 'Bet against market consensus and overreactions',
    riskLevel: 'high',
    features: ['Counter-trend', 'Mean reversion', 'Market corrections']
  },
  {
    id: 'balanced',
    name: 'Balanced Approach',
    icon: BarChart3,
    description: 'Mix of value and momentum with risk management',
    riskLevel: 'low',
    features: ['Diversified', 'Risk-controlled', 'Steady returns']
  }
];

export default function TradingBot() {
  const [botStatus, setBotStatus] = useState('stopped'); // stopped, running, paused
  const [selectedStrategy, setSelectedStrategy] = useState('balanced');
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [botConfig, setBotConfig] = useState({
    maxPerTrade: 100,
    riskTolerance: 50,
    minEdge: 10,
    maxDailyTrades: 10,
    autoTrade: false
  });
  
  const queryClient = useQueryClient();

  const { data: markets = [] } = useQuery({
    queryKey: ['markets'],
    queryFn: () => base44.entities.Market.list('-volume', 50),
  });

  const { data: trades = [] } = useQuery({
    queryKey: ['all-trades'],
    queryFn: () => base44.entities.Trade.list('-created_date', 100),
  });

  const { data: positions = [] } = useQuery({
    queryKey: ['positions'],
    queryFn: () => base44.entities.Position.list('-created_date', 50),
  });

  // Subscribe to conversation updates
  useEffect(() => {
    if (!conversation?.id) return;

    const unsubscribe = base44.agents.subscribeToConversation(conversation.id, (data) => {
      setMessages(data.messages || []);
    });

    return () => unsubscribe();
  }, [conversation?.id]);

  const initializeBot = async () => {
    try {
      const newConv = await base44.agents.createConversation({
        agent_name: 'trading_bot',
        metadata: {
          name: 'Trading Bot Session',
          strategy: selectedStrategy,
          config: botConfig
        }
      });
      setConversation(newConv);
      return newConv;
    } catch (error) {
      toast.error('Failed to initialize bot');
      console.error(error);
    }
  };

  const startBot = async () => {
    setBotStatus('running');
    toast.success('Trading bot started!');
    
    let conv = conversation;
    if (!conv) {
      conv = await initializeBot();
    }
    
    if (conv) {
      const strategyDesc = strategies.find(s => s.id === selectedStrategy)?.description || '';
      const prompt = `You are now active as a trading bot using the ${selectedStrategy} strategy: ${strategyDesc}

Bot Configuration:
- Max per trade: $${botConfig.maxPerTrade}
- Risk tolerance: ${botConfig.riskTolerance}%
- Minimum edge required: ${botConfig.minEdge}%
- Max daily trades: ${botConfig.maxDailyTrades}
- Auto-trade: ${botConfig.autoTrade ? 'Enabled' : 'Disabled'}

Please analyze the current markets and identify 2-3 trading opportunities. For each opportunity, explain:
1. Which market and side (YES/NO)
2. Current probability and your analysis
3. Why it's mispriced (if value strategy) or trending (if momentum)
4. Recommended trade size
5. Expected value calculation

After your analysis, ${botConfig.autoTrade ? 'execute the trades automatically' : 'wait for my approval before executing trades'}.

Begin your analysis now.`;

      await base44.agents.addMessage(conv, {
        role: 'user',
        content: prompt
      });
    }
  };

  const pauseBot = () => {
    setBotStatus('paused');
    toast.info('Trading bot paused');
  };

  const stopBot = async () => {
    setBotStatus('stopped');
    setConversation(null);
    setMessages([]);
    toast.info('Trading bot stopped');
  };

  const askBotToAnalyze = async (marketId) => {
    if (!conversation) {
      toast.error('Start the bot first');
      return;
    }

    const market = markets.find(m => m.id === marketId);
    if (!market) return;

    const prompt = `Analyze this specific market in detail:

Market: "${market.title}"
Category: ${market.category}
Current YES probability: ${market.yes_probability}%
Volume: $${market.volume}
Ends: ${market.end_date}

Provide a comprehensive analysis including:
1. Is this market correctly priced?
2. What should the probability be based on available information?
3. Should I buy YES, buy NO, or avoid this market?
4. What size trade do you recommend?
5. What's the expected value?

If you recommend a trade and auto-trade is enabled, execute it now.`;

    await base44.agents.addMessage(conversation, {
      role: 'user',
      content: prompt
    });
  };

  const sendCustomPrompt = async (prompt) => {
    if (!conversation) {
      toast.error('Start the bot first');
      return;
    }

    await base44.agents.addMessage(conversation, {
      role: 'user',
      content: prompt
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">AI Trading Bot</h1>
                <p className="text-zinc-400">Automated prediction market trading assistant</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={`
                ${botStatus === 'running' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : ''}
                ${botStatus === 'paused' ? 'border-yellow-500 text-yellow-400 bg-yellow-500/10' : ''}
                ${botStatus === 'stopped' ? 'border-zinc-600 text-zinc-400' : ''}
              `}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  botStatus === 'running' ? 'bg-emerald-400 animate-pulse' : 
                  botStatus === 'paused' ? 'bg-yellow-400' : 'bg-zinc-400'
                }`} />
                {botStatus.toUpperCase()}
              </Badge>
              
              {botStatus === 'stopped' ? (
                <Button 
                  onClick={startBot}
                  className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Bot
                </Button>
              ) : botStatus === 'running' ? (
                <>
                  <Button onClick={pauseBot} variant="outline" className="border-zinc-700">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                  <Button onClick={stopBot} variant="outline" className="border-rose-700 text-rose-400 hover:bg-rose-500/10">
                    Stop
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={startBot} className="bg-emerald-600 hover:bg-emerald-500">
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </Button>
                  <Button onClick={stopBot} variant="outline" className="border-rose-700 text-rose-400 hover:bg-rose-500/10">
                    Stop
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="mb-8">
          <BotStats trades={trades} positions={positions} />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Activity & Strategies */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="activity" className="w-full">
              <TabsList className="bg-zinc-900 border border-zinc-800 mb-6">
                <TabsTrigger value="activity" className="data-[state=active]:bg-purple-500/20">
                  <Activity className="h-4 w-4 mr-2" />
                  Activity Feed
                </TabsTrigger>
                <TabsTrigger value="strategy" className="data-[state=active]:bg-purple-500/20">
                  <Brain className="h-4 w-4 mr-2" />
                  Strategy
                </TabsTrigger>
                <TabsTrigger value="markets" className="data-[state=active]:bg-purple-500/20">
                  <Target className="h-4 w-4 mr-2" />
                  Markets
                </TabsTrigger>
              </TabsList>

              <TabsContent value="activity" className="mt-0">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Bot Activity</h3>
                    {messages.length > 0 && (
                      <Badge className="bg-purple-500/20 text-purple-400 border-0">
                        {messages.length} events
                      </Badge>
                    )}
                  </div>
                  
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <Bot className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                      <p className="text-zinc-500 mb-2">No bot activity yet</p>
                      <p className="text-sm text-zinc-600">Start the bot to see trading activity</p>
                    </div>
                  ) : (
                    <div className="max-h-[600px] overflow-y-auto">
                      <BotActivityFeed messages={messages} />
                    </div>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="strategy" className="mt-0">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Select Trading Strategy</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {strategies.map((strategy) => (
                      <BotStrategyCard
                        key={strategy.id}
                        strategy={strategy}
                        selected={selectedStrategy === strategy.id}
                        onSelect={setSelectedStrategy}
                      />
                    ))}
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="markets" className="mt-0">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Available Markets</h3>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                   {markets && markets.length > 0 ? markets.map((market) => (
                      <div 
                        key={market.id}
                        className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl hover:bg-zinc-800 transition-colors"
                      >
                        <div className="flex-1 min-w-0 mr-4">
                          <p className="text-white font-medium text-sm line-clamp-1">{market.title}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-emerald-400 text-xs">{market.yes_probability}% YES</span>
                            <span className="text-zinc-600">•</span>
                            <span className="text-zinc-500 text-xs">${market.volume?.toLocaleString()} vol</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => askBotToAnalyze(market.id)}
                          disabled={!conversation}
                          className="border-zinc-700 text-purple-400 hover:bg-purple-500/10"
                        >
                          <Brain className="h-3 w-3 mr-1" />
                          Analyze
                        </Button>
                      </div>
                    )) : (
                      <div className="text-center py-8">
                        <p className="text-zinc-500">No markets available</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Configuration */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BotConfigPanel
                config={botConfig}
                onConfigChange={setBotConfig}
                onSave={() => toast.success('Configuration saved!')}
              />
              
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-6 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-400" />
                  Quick Commands
                </h3>
                <div className="space-y-2">
                  <Button
                    onClick={() => sendCustomPrompt('Show me your top 3 trading opportunities right now')}
                    disabled={!conversation}
                    variant="outline"
                    className="w-full justify-start border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  >
                    Find Opportunities
                  </Button>
                  <Button
                    onClick={() => sendCustomPrompt('Analyze my current positions and suggest what to do')}
                    disabled={!conversation}
                    variant="outline"
                    className="w-full justify-start border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  >
                    Review Positions
                  </Button>
                  <Button
                    onClick={() => sendCustomPrompt('What are the highest volume markets I should watch?')}
                    disabled={!conversation}
                    variant="outline"
                    className="w-full justify-start border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  >
                    Check Hot Markets
                  </Button>
                  <Button
                    onClick={() => sendCustomPrompt('Give me a detailed market summary')}
                    disabled={!conversation}
                    variant="outline"
                    className="w-full justify-start border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  >
                    Market Summary
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}