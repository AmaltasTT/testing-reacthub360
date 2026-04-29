"use client";

import React from 'react';
import { motion } from 'motion/react';

interface ProfileHeaderProps {
  userName: string;
  userRole: string;
  avatarUrl?: string;
}

export function ProfileHeader({ userName, userRole, avatarUrl }: ProfileHeaderProps) {
  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full mb-10"
    >
      {/* Contained surface with glass effect and gradient wash */}
      <div className="max-w-[95%] mx-auto relative rounded-2xl overflow-hidden">
        {/* Subtle glass effect and lavender-to-white gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/40 via-white/60 to-white/80 backdrop-blur-sm" />

        {/* Faint vertical accent line on left edge */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-400 via-violet-300 to-transparent opacity-60" />

        {/* Soft border for contained feel */}
        <div className="absolute inset-0 border border-violet-200/30 rounded-2xl" />

        {/* Content */}
        <div className="relative flex items-center justify-between py-10 px-10">
          {/* Left: Typography Hierarchy */}
          <div>
            {/* Kicker */}
            <div className="text-xs uppercase tracking-widest text-slate-400 mb-3 font-light">
              My Profile
            </div>

            {/* Main Title */}
            <h1 className="text-slate-900 mb-2 font-semibold text-3xl">
              Profile & Account Controls
            </h1>

            {/* Subtitle */}
            <p className="text-slate-500 text-sm">
              Manage your settings and workspace preferences
            </p>
          </div>

          {/* Right: Identity cluster - aligned with profile card */}
          <div className="flex items-center gap-3">
            {/* Avatar (left) */}
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={userName}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-violet-200 shadow-sm"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-400 to-purple-400 flex items-center justify-center text-white text-sm shadow-md">
                {initials}
              </div>
            )}

            {/* Text stack (right) */}
            <div>
              <div className="text-slate-900 font-medium">{userName}</div>
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-violet-100/60 text-violet-700 border border-violet-200/40 text-xs mt-1">
                {userRole}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
