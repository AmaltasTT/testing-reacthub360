'use client'

import { motion } from 'motion/react';
import { Wifi, Settings } from 'lucide-react';
import { Button } from './ui/button';

export function ConnectionStatusBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
      className="mb-12"
    >
      <div className="mb-3">
        <h3 className="text-gray-700 text-sm mb-1">Connection Status</h3>
        <p className="text-gray-500 text-xs">Manage your platform integrations and data sync</p>
      </div>
      <div className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-xl border border-violet-300/60 px-6 py-4 shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-green-500" 
              />
              <span>6 channels connected · 2 pending</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-green-500" />
              <span>Synced 3h ago</span>
            </div>
          </div>
          
          <Button className="bg-white hover:bg-gray-50 text-gray-900 border border-violet-300/60 gap-2 shadow-sm hover:shadow-md transition-all">
            <Settings className="w-4 h-4" />
            Manage Connections
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
