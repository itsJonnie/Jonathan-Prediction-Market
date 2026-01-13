import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Check, Sparkles, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import AISuggestions from '@/components/markets/AISuggestions';
import MediaUpload from '@/components/markets/MediaUpload';

const STEPS = [
  { id: 1, title: 'AI Suggestions', icon: Sparkles },
  { id: 2, title: 'Market Details', icon: Lightbulb },
  { id: 3, title: 'Media & Launch', icon: Check },
];

export default function CreateMarket() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technology',
    resolution_criteria: '',
    end_date: '',
    yes_probability: 50,
    image_url: '',
    media_urls: [],
    volume: 0,
    status: 'active',
    is_featured: false,
    is_trending: false,
  });

  const createMarketMutation = useMutation({
    mutationFn: (data) => base44.entities.Market.create(data),
    onSuccess: (market) => {
      queryClient.invalidateQueries({ queryKey: ['markets'] });
      toast.success('Market created successfully!');
      navigate(createPageUrl('MarketDetail') + `?id=${market.id}`);
    },
    onError: (error) => {
      toast.error('Failed to create market');
      console.error(error);
    },
  });

  const handleAISuggestion = (suggestion) => {
    setFormData({
      ...formData,
      title: suggestion.title,
      description: suggestion.description,
      category: suggestion.category,
      resolution_criteria: suggestion.resolution_criteria,
      end_date: suggestion.end_date,
      yes_probability: suggestion.yes_probability,
    });
    setCurrentStep(2);
    toast.success('AI suggestion applied!');
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.end_date) {
      toast.error('Please fill in required fields');
      return;
    }
    createMarketMutation.mutate(formData);
  };

  const nextStep = () => {
    if (currentStep === 2 && (!formData.title || !formData.description || !formData.end_date)) {
      toast.error('Please complete all required fields');
      return;
    }
    setCurrentStep(Math.min(3, currentStep + 1));
  };

  const prevStep = () => setCurrentStep(Math.max(1, currentStep - 1));

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl('Home'))}
            className="text-zinc-400 hover:text-white mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Markets
          </Button>
          <h1 className="text-3xl font-bold text-white">Create New Market</h1>
          <p className="text-zinc-400 mt-2">Launch a prediction market in minutes</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      isActive 
                        ? 'bg-purple-600 border-purple-600' 
                        : isCompleted 
                        ? 'bg-emerald-600 border-emerald-600' 
                        : 'bg-zinc-800 border-zinc-700'
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        isActive || isCompleted ? 'text-white' : 'text-zinc-500'
                      }`} />
                    </div>
                    <span className={`text-xs mt-2 ${
                      isActive ? 'text-white font-medium' : 'text-zinc-500'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-emerald-600' : 'bg-zinc-800'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 mb-6"
          >
            {/* Step 1: AI Suggestions */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Get AI-Powered Suggestions</h2>
                <p className="text-zinc-400 mb-6">
                  Let AI suggest trending prediction markets, or create your own from scratch.
                </p>
                <AISuggestions onSelectSuggestion={handleAISuggestion} />
              </div>
            )}

            {/* Step 2: Market Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Market Details</h2>
                
                <div>
                  <Label htmlFor="title" className="text-zinc-300 mb-2 block">
                    Market Question <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Will Tesla release the Roadster in 2025?"
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-zinc-300 mb-2 block">
                    Description <span className="text-red-400">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide context and details about the market..."
                    className="bg-zinc-800 border-zinc-700 text-white h-32"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category" className="text-zinc-300 mb-2 block">
                      Category
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="end_date" className="text-zinc-300 mb-2 block">
                      End Date <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="resolution_criteria" className="text-zinc-300 mb-2 block">
                    Resolution Criteria
                  </Label>
                  <Textarea
                    id="resolution_criteria"
                    value={formData.resolution_criteria}
                    onChange={(e) => setFormData({ ...formData, resolution_criteria: e.target.value })}
                    placeholder="How will this market be resolved? What sources will be used?"
                    className="bg-zinc-800 border-zinc-700 text-white h-24"
                  />
                </div>

                <div>
                  <Label htmlFor="probability" className="text-zinc-300 mb-2 block">
                    Initial Probability: {formData.yes_probability}%
                  </Label>
                  <input
                    id="probability"
                    type="range"
                    min="0"
                    max="100"
                    value={formData.yes_probability}
                    onChange={(e) => setFormData({ ...formData, yes_probability: parseInt(e.target.value) })}
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Media & Launch */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Add Media & Launch</h2>
                
                <div>
                  <Label className="text-zinc-300 mb-3 block">
                    Media Assets (Optional)
                  </Label>
                  <MediaUpload
                    mediaUrls={formData.media_urls}
                    onMediaChange={(urls) => {
                      setFormData({
                        ...formData,
                        media_urls: urls,
                        image_url: urls[0] || formData.image_url
                      });
                    }}
                  />
                </div>

                {/* Preview */}
                <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700">
                  <h3 className="text-sm font-medium text-zinc-400 mb-3">Preview</h3>
                  <div className="bg-zinc-900 rounded-lg p-4">
                    <div className="text-white font-medium mb-2">{formData.title || 'Market Title'}</div>
                    <p className="text-sm text-zinc-400 mb-3 line-clamp-2">
                      {formData.description || 'Market description will appear here...'}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span className="capitalize">{formData.category}</span>
                      <span>•</span>
                      <span>{formData.end_date || 'End date'}</span>
                      <span>•</span>
                      <span className="text-emerald-400">{formData.yes_probability}% Yes</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="border-zinc-700 text-zinc-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < 3 ? (
            <Button onClick={nextStep} className="bg-purple-600 hover:bg-purple-700">
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={createMarketMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Launch Market
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}