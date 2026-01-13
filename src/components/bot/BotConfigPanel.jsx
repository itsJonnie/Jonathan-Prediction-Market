import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings, Zap, DollarSign, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BotConfigPanel({ config, onConfigChange, onSave }) {
  const [localConfig, setLocalConfig] = useState(config);
  
  const handleChange = (key, value) => {
    const updated = { ...localConfig, [key]: value };
    setLocalConfig(updated);
    onConfigChange(updated);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-500/20 rounded-xl">
          <Settings className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Bot Configuration</h3>
          <p className="text-sm text-zinc-500">Customize your trading bot settings</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Max Trade Amount */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-white flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-zinc-400" />
              Max Per Trade
            </Label>
            <span className="text-purple-400 font-semibold">${localConfig.maxPerTrade}</span>
          </div>
          <Slider
            value={[localConfig.maxPerTrade]}
            onValueChange={([value]) => handleChange('maxPerTrade', value)}
            min={10}
            max={500}
            step={10}
            className="mb-2"
          />
          <p className="text-xs text-zinc-600">Maximum amount the bot can invest per trade</p>
        </div>
        
        {/* Risk Tolerance */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-zinc-400" />
              Risk Tolerance
            </Label>
            <Badge variant="outline" className={`
              ${localConfig.riskTolerance <= 30 ? 'border-green-500/50 text-green-400' : ''}
              ${localConfig.riskTolerance > 30 && localConfig.riskTolerance <= 60 ? 'border-yellow-500/50 text-yellow-400' : ''}
              ${localConfig.riskTolerance > 60 ? 'border-red-500/50 text-red-400' : ''}
            `}>
              {localConfig.riskTolerance <= 30 ? 'Low' : localConfig.riskTolerance <= 60 ? 'Medium' : 'High'}
            </Badge>
          </div>
          <Slider
            value={[localConfig.riskTolerance]}
            onValueChange={([value]) => handleChange('riskTolerance', value)}
            min={1}
            max={100}
            step={1}
            className="mb-2"
          />
          <p className="text-xs text-zinc-600">How aggressive the bot should be with trades</p>
        </div>
        
        {/* Min Probability Edge */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-white">Minimum Edge Required</Label>
            <span className="text-purple-400 font-semibold">{localConfig.minEdge}%</span>
          </div>
          <Slider
            value={[localConfig.minEdge]}
            onValueChange={([value]) => handleChange('minEdge', value)}
            min={1}
            max={30}
            step={1}
            className="mb-2"
          />
          <p className="text-xs text-zinc-600">Minimum probability edge needed to place a trade</p>
        </div>
        
        {/* Max Daily Trades */}
        <div>
          <Label className="text-white mb-3 block">Max Daily Trades</Label>
          <Input
            type="number"
            value={localConfig.maxDailyTrades}
            onChange={(e) => handleChange('maxDailyTrades', parseInt(e.target.value) || 0)}
            className="bg-zinc-800 border-zinc-700 text-white"
            min={1}
            max={100}
          />
          <p className="text-xs text-zinc-600 mt-2">Maximum number of trades per day</p>
        </div>
        
        {/* Auto-Trade Toggle */}
        <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl">
          <div>
            <p className="text-white font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-400" />
              Auto-Trading
            </p>
            <p className="text-xs text-zinc-500 mt-1">Enable automated trade execution</p>
          </div>
          <Switch
            checked={localConfig.autoTrade}
            onCheckedChange={(checked) => handleChange('autoTrade', checked)}
          />
        </div>
      </div>
      
      <Button 
        onClick={onSave}
        className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
      >
        Save Configuration
      </Button>
    </motion.div>
  );
}