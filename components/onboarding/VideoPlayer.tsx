"use client";

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Maximize, RotateCcw } from 'lucide-react';

interface VideoPlayerProps {
  posterSrc: string;
  videoSrc?: string;
}

export function VideoPlayer({ posterSrc, videoSrc }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // 3:00 minutes default
  const [showControls, setShowControls] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const videoRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide controls after 3s when playing
  useEffect(() => {
    if (isPlaying && !isHovering) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    } else {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, isHovering]);

  const handlePlayPause = () => {
    if (isEnded) {
      setIsEnded(false);
      setCurrentTime(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / duration) * 100;

  // Simulate video progress when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isEnded) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            setIsEnded(true);
            return duration;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isEnded, duration]);

  const handleFullscreen = (e?: React.MouseEvent) => {
    // Prevent event bubbling
    if (e) {
      e.stopPropagation();
    }

    // Fullscreen API is not available in iframe environments
    // Silently ignore the request
  };

  return (
    <div
      ref={videoRef}
      className="relative w-full aspect-video bg-slate-900 rounded-2xl shadow-2xl overflow-hidden cursor-pointer group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => {
        // Only toggle play/pause if not clicking on controls
        const target = e.target as HTMLElement;
        if (!target.closest('.video-controls')) {
          handlePlayPause();
        }
      }}
    >
      {/* Demo Preview Badge */}
      <div className="absolute top-4 right-4 z-20">
        <span className="inline-block bg-violet-500/20 text-violet-300 text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
          Demo Preview
        </span>
      </div>

      {/* Video/Poster Content */}
      <img
        src={posterSrc}
        alt="REACTIQ360 dashboard demo"
        className="w-full h-full object-cover"
      />

      {/* Center Play/Pause/Replay Button */}
      {(!isPlaying || isEnded) && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <button
            onClick={handlePlayPause}
            className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transition-all hover:bg-white/30 hover:scale-110 active:scale-100"
            aria-label={isEnded ? "Replay video" : "Play video"}
          >
            {isEnded ? (
              <RotateCcw className="w-10 h-10 text-white" />
            ) : (
              <Play className="w-10 h-10 text-white ml-1" />
            )}
          </button>
        </div>
      )}

      {/* Video Controls Overlay */}
      <div
        className={`video-controls absolute bottom-0 left-0 right-0 z-10 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

        {/* Controls Content */}
        <div className="relative px-4 pb-4 pt-8">
          {/* Progress Bar */}
          <div
            className="w-full h-1 bg-white/20 rounded-full mb-3 cursor-pointer group/progress relative"
            onClick={handleProgressClick}
          >
            {/* Played Progress */}
            <div
              className="h-full bg-violet-500 rounded-full transition-all relative"
              style={{ width: `${progress}%` }}
            >
              {/* Scrubber Dot */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity shadow-lg" />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            {/* Left Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePlayPause}
                className="text-white hover:text-violet-300 transition-colors p-1"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" fill="currentColor" />
                ) : (
                  <Play className="w-5 h-5" fill="currentColor" />
                )}
              </button>

              <span className="text-white text-sm font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Right Controls */}
            <button
              onClick={handleFullscreen}
              className="text-white hover:text-violet-300 transition-colors p-1"
              aria-label="Toggle fullscreen"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
