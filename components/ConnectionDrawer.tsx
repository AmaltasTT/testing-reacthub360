"use client";

import { X, Check } from 'lucide-react';
import { useState } from 'react';

interface ConnectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  channelName: string;
  channelIcon: string;
  onConnect: () => void;
}

export function ConnectionDrawer({ 
  isOpen, 
  onClose, 
  channelName, 
  channelIcon, 
  onConnect 
}: ConnectionDrawerProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  if (!isOpen) return null;

  const handleConnect = () => {
    setIsConnecting(true);
    
    // Simulate OAuth/connection flow
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      
      // Wait a moment to show success, then close and notify parent
      setTimeout(() => {
        onConnect();
        onClose();
        // Reset state for next time
        setTimeout(() => setIsConnected(false), 300);
      }, 1000);
    }, 1500);
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/20 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <span className="text-xl">{channelIcon}</span>
            </div>
            <h2 className="text-xl font-semibold text-slate-900">
              Connect {channelName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {!isConnected ? (
            <>
              <p className="text-slate-700 mb-4">
                Connect your {channelName} account to start tracking campaign signals and performance data.
              </p>
              
              <div className="bg-slate-50 rounded-lg p-4 mb-6 space-y-3">
                <h3 className="font-medium text-slate-900">What you'll get:</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>Real-time signal tracking and interpretation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>Automated insights as data becomes available</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>Cross-channel performance analysis</span>
                  </li>
                </ul>
              </div>

              <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-violet-900">
                  <strong>Security:</strong> We use OAuth 2.0 for secure authentication. 
                  We never store your login credentials.
                </p>
              </div>

              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full px-6 py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 disabled:bg-violet-400 disabled:cursor-wait transition-colors flex items-center justify-center gap-2"
              >
                {isConnecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Connecting...
                  </>
                ) : (
                  `Connect ${channelName}`
                )}
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Check className="w-7 h-7 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Connected successfully
              </h3>
              <p className="text-slate-600">
                {channelName} is now ready to track campaign signals
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
