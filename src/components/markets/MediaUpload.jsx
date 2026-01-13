import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Image as ImageIcon, Video, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function MediaUpload({ mediaUrls, onMediaChange }) {
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(file => 
        base44.integrations.Core.UploadFile({ file })
      );
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map(r => r.file_url);
      onMediaChange([...mediaUrls, ...newUrls]);
      toast.success(`Uploaded ${files.length} file(s)`);
    } catch (error) {
      toast.error('Failed to upload files');
      console.error(error);
    }
    setUploading(false);
  };

  const handleAddVideoUrl = () => {
    if (!videoUrl.trim()) return;
    
    // Validate it's a video URL (YouTube, Vimeo, etc.)
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') || 
        videoUrl.includes('vimeo.com') || videoUrl.includes('video')) {
      onMediaChange([...mediaUrls, videoUrl]);
      setVideoUrl('');
      toast.success('Video URL added');
    } else {
      toast.error('Please enter a valid video URL');
    }
  };

  const removeMedia = (index) => {
    onMediaChange(mediaUrls.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* File Upload */}
      <div className="border-2 border-dashed border-zinc-700 rounded-xl p-6 text-center hover:border-purple-500/50 transition-colors">
        <input
          type="file"
          id="file-upload"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          {uploading ? (
            <Loader2 className="h-8 w-8 text-purple-500 mx-auto mb-2 animate-spin" />
          ) : (
            <Upload className="h-8 w-8 text-zinc-500 mx-auto mb-2" />
          )}
          <p className="text-white font-medium mb-1">Upload Images</p>
          <p className="text-xs text-zinc-500">Click to browse or drag and drop</p>
        </label>
      </div>

      {/* Video URL Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Add video URL (YouTube, Vimeo, etc.)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddVideoUrl()}
          className="bg-zinc-800 border-zinc-700 text-white"
        />
        <Button
          onClick={handleAddVideoUrl}
          variant="outline"
          className="border-zinc-700"
        >
          <Video className="h-4 w-4" />
        </Button>
      </div>

      {/* Media Preview Grid */}
      <AnimatePresence>
        {mediaUrls.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          >
            {mediaUrls.map((url, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group aspect-video bg-zinc-800 rounded-lg overflow-hidden"
              >
                {url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo') ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="h-8 w-8 text-zinc-500" />
                  </div>
                ) : (
                  <img src={url} alt={`Media ${index + 1}`} className="w-full h-full object-cover" />
                )}
                <button
                  onClick={() => removeMedia(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3 text-white" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}