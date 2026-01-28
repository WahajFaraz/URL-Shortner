import { motion } from 'framer-motion';
import { GlassCard, Badge, Button } from '../common/UIComponents.jsx';
import { copyToClipboard, truncateUrl, formatDate } from '../../utils/helpers.js';
import { itemVariants } from '../../utils/animations.js';
import toast from 'react-hot-toast';
import QRCode from 'qrcode.react';
import { useState } from 'react';

// Base URL used for generated short links
// - In production, set VITE_BACKEND_BASE_URL in Vercel to "https://url-shortner-back.vercel.app"
// - In local dev, this falls back to your local Express server
const BACKEND_BASE_URL =
  import.meta.env.VITE_BACKEND_BASE_URL ||
  (import.meta.env.MODE === 'production'
    ? 'https://url-shortner-back.vercel.app'
    : 'http://localhost:5000');

export const UrlCard = ({ url, onEdit, onDelete, onViewAnalytics }) => {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const shortPath = url.shortCode || url.customAlias;
  const shortUrl = `${BACKEND_BASE_URL}/${shortPath}`;
  const displayShortUrl = `${window.location.origin}/${shortPath}`;
  const cleanShortUrl = `short.ly/${shortPath}`;

  const handleCopy = async () => {
    const copySuccess = await copyToClipboard(shortUrl);
    if (copySuccess) {
      setCopied(true);
      toast.success('Short URL copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShortUrlClick = (e) => {
    e.preventDefault();
    // Open the backend URL for proper redirect
    window.open(shortUrl, '_blank');
  };

  const handleOriginalUrlClick = (e) => {
    e.preventDefault();
    window.open(url.originalUrl, '_blank');
  };

  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ y: -2, transition: { duration: 0.2, ease: "easeOut" } }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard className="group relative overflow-hidden border-0 bg-gradient-to-br from-slate-800/60 via-slate-900/60 to-slate-800/60 backdrop-blur-lg transition-all duration-300 shadow-xl">
        
        {/* Simplified gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative p-6 space-y-4">
          
          {/* Header Section with enhanced styling */}
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              {url.title && (
                <h3 className="text-xl font-bold text-white mb-3 transition-colors duration-200">
                  {url.title}
                </h3>
              )}
              
              {/* URL Display */}
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-black/40 to-black/20 rounded-xl p-3 border border-white/10 transition-colors duration-200">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">Original URL</p>
                      <a 
                        href={url.originalUrl}
                        onClick={handleOriginalUrlClick}
                        className="text-sm text-gray-300 font-mono hover:text-white transition-colors duration-200 cursor-pointer truncate block"
                        title={url.originalUrl}
                      >
                        {url.originalUrl}
                      </a>
                    </div>
                    <button
                      onClick={handleOriginalUrlClick}
                      className="px-3 py-2 bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-300 rounded-lg text-sm font-medium transition-colors duration-200 hover:from-green-500/40 hover:to-emerald-500/40 hover:text-green-200 flex-shrink-0"
                    >
                      🔗 Open
                    </button>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-xl p-3 border border-indigo-400/30 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-indigo-300 uppercase tracking-wider mb-1 font-semibold">Short URL</p>
                      <a 
                        href={shortUrl} 
                        onClick={handleShortUrlClick}
                        className="text-sm font-mono text-white hover:text-indigo-200 transition-colors duration-200 cursor-pointer truncate block"
                        title={shortUrl}
                      >
                        {cleanShortUrl}
                      </a>
                    </div>
                    <button
                      onClick={handleCopy}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex-shrink-0 ${
                        copied 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                          : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      {copied ? '✓ Copied!' : '📋 Copy'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Status Badges */}
            <div className="flex flex-col gap-3">
              {!url.isActive && (
                <Badge variant="danger" className="animate-pulse shadow-lg shadow-red-500/30">
                  ⚠️ Inactive
                </Badge>
              )}
              {url.customAlias && (
                <Badge variant="default" className="shadow-lg shadow-indigo-500/30">
                  ⭐ Custom
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          {url.description && (
            <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl p-3 border border-white/10 transition-colors duration-200">
              <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
                {url.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {url.tags && url.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {url.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-sm rounded-full border border-purple-400/30 transition-colors duration-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Stats Bar */}
          <div className="bg-gradient-to-r from-slate-700/30 to-slate-800/30 rounded-xl p-3 border border-white/10 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-300">📊</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Clicks</p>
                    <p className="text-lg font-bold text-indigo-400">{url.totalClicks || 0}</p>
                  </div>
                </div>
                
                {url.expirationDate && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-lg flex items-center justify-center">
                      <span className="text-yellow-400">⏰</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Expires</p>
                      <p className="text-sm font-semibold text-yellow-400">
                        {formatDate(url.expirationDate)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Created</p>
                <p className="text-sm text-gray-300">{formatDate(url.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={handleCopy}
              className="flex flex-col items-center gap-1 py-3"
            >
              <span className="text-lg">📋</span>
              <span className="text-xs">Copy</span>
            </Button>
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={() => setShowQR(!showQR)}
              className="flex flex-col items-center gap-1 py-3"
            >
              <span className="text-lg">📱</span>
              <span className="text-xs">QR</span>
            </Button>
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={() => onViewAnalytics(url._id)}
              className="flex flex-col items-center gap-1 py-3"
            >
              <span className="text-lg">📊</span>
              <span className="text-xs">Analytics</span>
            </Button>
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={() => onEdit(url)}
              className="flex flex-col items-center gap-1 py-3"
            >
              <span className="text-lg">✏️</span>
              <span className="text-xs">Edit</span>
            </Button>
            <Button 
              size="sm" 
              variant="danger" 
              onClick={() => onDelete(url._id)}
              className="flex flex-col items-center gap-1 py-3"
            >
              <span className="text-lg">🗑️</span>
              <span className="text-xs">Delete</span>
            </Button>
          </div>

          {/* QR Code Section */}
          {showQR && (
            <motion.div 
              className="flex justify-center pt-6 border-t border-white/20"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-center bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl p-8 border border-white/10 shadow-xl">
                <QRCode value={shortUrl} size={180} bgColor="#1e293b" fgColor="#ffffff" level="H" />
                <p className="text-sm text-gray-300 mt-4 font-medium">Scan to visit</p>
                <p className="text-xs text-gray-400 mt-2 font-mono">{cleanShortUrl}</p>
              </div>
            </motion.div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
};
