'use client';

import { useState, useEffect, useRef } from 'react';
import { CameraIcon, DotsIcon, ChevronIcon } from '@/components/Icons';

// Types and Interfaces
interface FormAnalysis {
  stance: number;
  grip: number;
  followThrough: number;
  timing: number;
  balance: number;
}

interface ShotStats {
  optimal: number;
  choices: number;
  success: number;
  improvement: number;
}

interface VideoMode {
  type: 'form-analysis' | 'shot-selection';
  title: string;
  description: string;
}

interface ScanningState {
  isScanning: boolean;
  progress: number;
  currentPhase: string;
}

// Constants
const VIDEO_MODES: VideoMode[] = [
  {
    type: 'form-analysis',
    title: 'Form Analysis',
    description: 'AI-powered stance and technique evaluation',
  },
  {
    type: 'shot-selection',
    title: 'Shot Selection',
    description: 'Strategic decision making analysis',
  },
];

const SCANNING_PHASES = [
  'Initializing camera...',
  'Detecting player position...',
  'Analyzing body posture...',
  'Evaluating form quality...',
  'Generating insights...',
];

const SHOT_TYPES = [
  { name: 'Cover Drive', percentage: 72, color: 'lime' },
  { name: 'Pull Shot', percentage: 68, color: 'green' },
  { name: 'Cut Shot', percentage: 85, color: 'lime' },
  { name: 'Sweep', percentage: 54, color: 'yellow' },
];

// Main Component
export default function AICameraCard() {
  // State Management
  const [currentMode, setCurrentMode] = useState<'form-analysis' | 'shot-selection'>('form-analysis');
  const [scanningState, setScanningState] = useState<ScanningState>({
    isScanning: false,
    progress: 0,
    currentPhase: '',
  });
  const [formAnalysis, setFormAnalysis] = useState<FormAnalysis>({
    stance: 85,
    grip: 78,
    followThrough: 92,
    timing: 88,
    balance: 81,
  });
  const [shotStats, setShotStats] = useState<ShotStats>({
    optimal: 72,
    choices: 72,
    success: 78,
    improvement: 15,
  });
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);
  const [expandedDetails, setExpandedDetails] = useState(false);

  // Refs
  const videoRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout>();
  const scanningIntervalRef = useRef<NodeJS.Timeout>();

  // Effects
  useEffect(() => {
    if (isVideoPlaying) {
      progressIntervalRef.current = setInterval(() => {
        setVideoProgress((prev) => {
          if (prev >= 100) {
            setIsVideoPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 100);
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isVideoPlaying]);

  useEffect(() => {
    if (scanningState.isScanning) {
      let phaseIndex = 0;
      let progress = 0;

      scanningIntervalRef.current = setInterval(() => {
        progress += 2;
        
        if (progress >= 100) {
          setScanningState({
            isScanning: false,
            progress: 100,
            currentPhase: 'Analysis complete!',
          });
          clearInterval(scanningIntervalRef.current);
        } else {
          const newPhaseIndex = Math.floor((progress / 100) * SCANNING_PHASES.length);
          if (newPhaseIndex !== phaseIndex) {
            phaseIndex = newPhaseIndex;
          }
          
          setScanningState({
            isScanning: true,
            progress,
            currentPhase: SCANNING_PHASES[phaseIndex],
          });
        }
      }, 100);
    }

    return () => {
      if (scanningIntervalRef.current) {
        clearInterval(scanningIntervalRef.current);
      }
    };
  }, [scanningState.isScanning]);

  // Event Handlers
  const toggleMode = () => {
    setCurrentMode((prev) => 
      prev === 'form-analysis' ? 'shot-selection' : 'form-analysis'
    );
  };

  const startScanning = () => {
    setScanningState({
      isScanning: true,
      progress: 0,
      currentPhase: SCANNING_PHASES[0],
    });
  };

  const toggleVideoPlayback = () => {
    setIsVideoPlaying(!isVideoPlaying);
    if (!isVideoPlaying) {
      setVideoProgress(0);
    }
  };

  const handleStatHover = (statName: string) => {
    setHoveredStat(statName);
  };

  const handleStatLeave = () => {
    setHoveredStat(null);
  };

  // Render Helpers
  const renderCircularProgress = () => {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (formAnalysis.stance / 100) * circumference;

    return (
      <div className="relative w-40 h-40">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Background circle */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
          />
          
          {/* Progress circle */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            filter="url(#glow)"
            className="transition-all duration-1000 ease-out"
          />
          
          {/* Inner glow */}
          <circle
            cx="70"
            cy="70"
            r={radius - 10}
            fill="none"
            stroke="#10b981"
            strokeWidth="1"
            opacity="0.3"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-white">{formAnalysis.stance}%</span>
          <span className="text-xs text-white/60 mt-1">Stance</span>
        </div>

        {/* Animated pulse */}
        <div className="absolute inset-0 rounded-full bg-lime-500/10 animate-pulse" />
      </div>
    );
  };

  const renderFormAnalysisStats = () => {
    const stats = [
      { label: 'Grip', value: formAnalysis.grip, icon: '👊' },
      { label: 'Follow Through', value: formAnalysis.followThrough, icon: '🏏' },
      { label: 'Timing', value: formAnalysis.timing, icon: '⏱️' },
      { label: 'Balance', value: formAnalysis.balance, icon: '⚖️' },
    ];

    return (
      <div className="grid grid-cols-2 gap-3 mt-6">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="bg-gradient-to-br from-white/5 to-white/0 rounded-xl p-4 border border-white/10 hover:border-lime-500/30 transition-all duration-300 cursor-pointer group"
            onMouseEnter={() => handleStatHover(stat.label)}
            onMouseLeave={handleStatLeave}
            style={{
              animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-lime-400 text-lg font-bold group-hover:scale-110 transition-transform">
                {stat.value}%
              </span>
            </div>
            <p className="text-white/60 text-sm font-medium">{stat.label}</p>
            
            {/* Progress bar */}
            <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-lime-400 to-lime-500 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: hoveredStat === stat.label ? '100%' : `${stat.value}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderShotSelectionStats = () => (
    <div className="space-y-4 mt-6">
      {/* Main stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-lime-500/20 to-lime-500/5 rounded-2xl p-6 border border-lime-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Optimal Shots</span>
            <span className="text-xs bg-lime-500/20 text-lime-400 px-2 py-1 rounded-full">
              +{shotStats.improvement}%
            </span>
          </div>
          <p className="text-4xl font-bold text-white">{shotStats.optimal}%</p>
          <p className="text-lime-400 text-xs mt-2">Above average</p>
        </div>

        <div className="bg-gradient-to-br from-lime-500/20 to-lime-500/5 rounded-2xl p-6 border border-lime-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Shot Choices</span>
            <div className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
          </div>
          <p className="text-4xl font-bold text-white">{shotStats.choices}%</p>
          <p className="text-lime-400 text-xs mt-2">Consistency rate</p>
        </div>
      </div>

      {/* Shot breakdown */}
      <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
        <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span>Shot Type Analysis</span>
          <button
            onClick={() => setExpandedDetails(!expandedDetails)}
            className="ml-auto text-lime-400 hover:text-lime-300 transition-colors"
          >
            <ChevronIcon 
              className={`transform transition-transform duration-300 ${expandedDetails ? 'rotate-180' : ''}`}
            />
          </button>
        </h4>
        
        <div className="space-y-3">
          {SHOT_TYPES.map((shot, index) => (
            <div
              key={shot.name}
              className="group"
              style={{
                animation: `slideInRight 0.5s ease-out ${index * 0.1}s both`,
              }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-white/80 text-sm">{shot.name}</span>
                <span className="text-lime-400 font-semibold text-sm">{shot.percentage}%</span>
              </div>
              
              <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r from-${shot.color}-400 to-${shot.color}-500 rounded-full transition-all duration-1000 ease-out group-hover:shadow-lg`}
                  style={{
                    width: `${shot.percentage}%`,
                    boxShadow: `0 0 10px ${shot.color === 'lime' ? '#a3e635' : shot.color === 'green' ? '#22c55e' : '#eab308'}`,
                  }}
                />
                
                {/* Animated shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:animate-shimmer" />
              </div>

              {expandedDetails && (
                <div className="mt-2 pl-4 text-xs text-white/40 animate-fadeIn">
                  Success rate in last 10 sessions
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderScanningOverlay = () => {
    if (!scanningState.isScanning && scanningState.progress !== 100) return null;

    return (
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center z-20">
        {/* Scanning animation */}
        <div className="relative w-32 h-32 mb-6">
          <div className="absolute inset-0 border-4 border-lime-500/30 rounded-full animate-ping" />
          <div className="absolute inset-0 border-4 border-lime-500/50 rounded-full animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <CameraIcon className="w-12 h-12 text-lime-400" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-64 mb-4">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-lime-400 via-lime-500 to-lime-400 rounded-full transition-all duration-300"
              style={{ width: `${scanningState.progress}%` }}
            />
          </div>
        </div>

        {/* Status text */}
        <p className="text-lime-400 text-sm font-medium animate-pulse">
          {scanningState.currentPhase}
        </p>
        <p className="text-white/40 text-xs mt-2">{scanningState.progress}% complete</p>
      </div>
    );
  };

  const renderVideoControls = () => (
    <div className="absolute bottom-4 left-4 right-4 z-10">
      <div className="bg-black/60 backdrop-blur-lg rounded-xl p-4 border border-white/10">
        {/* Progress bar */}
        <div className="mb-3">
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-lime-400 rounded-full transition-all"
              style={{ width: `${videoProgress}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={toggleVideoPlayback}
            className="w-10 h-10 rounded-full bg-lime-500 hover:bg-lime-400 transition-colors flex items-center justify-center group"
          >
            {isVideoPlaying ? (
              <div className="w-3 h-3 border-l-2 border-r-2 border-white" />
            ) : (
              <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1" />
            )}
          </button>

          <div className="flex items-center gap-3">
            <button className="text-white/60 hover:text-white transition-colors text-xs">
              Slow Mo
            </button>
            <button className="text-white/60 hover:text-white transition-colors text-xs">
              Frame by Frame
            </button>
            <button
              onClick={startScanning}
              className="px-4 py-2 bg-lime-500/20 hover:bg-lime-500/30 text-lime-400 rounded-lg text-xs font-semibold transition-all"
            >
              Analyze Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderModeSwitch = () => (
    <div className="flex items-center gap-2 mb-4">
      <button
        onClick={toggleMode}
        className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all"
      >
        <ChevronIcon className="w-4 h-4 text-lime-400 transform group-hover:translate-x-1 transition-transform" />
        <span className="text-white/60 text-sm">
          {currentMode === 'form-analysis' ? 'Switch to Shot Selection' : 'Switch to Form Analysis'}
        </span>
      </button>
    </div>
  );

  // Main Render - Left Camera Card (Form Analysis)
  return (
    <div className="bg-black rounded-3xl p-6 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-black text-xl tracking-tight">AI Camera</h3>
        <button className="text-white/40 hover:text-emerald-400 transition-colors p-2 hover:bg-emerald-500/10 rounded-lg">
          <DotsIcon />
        </button>
      </div>

      {/* Video/Analysis Area */}
      <div className="relative h-80 rounded-2xl overflow-hidden border border-white/10">
        {/* Background Image - Cricket player silhouette */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
          {/* Simulated cricket player silhouette */}
          <div className="absolute inset-0 flex items-end justify-center pb-0">
            <div className="relative w-full h-full">
              {/* Cricket stumps and player silhouette */}
              <div className="absolute bottom-0 left-1/4 w-32 h-48 bg-gradient-to-t from-white/10 to-transparent" style={{ clipPath: 'polygon(30% 0%, 70% 0%, 80% 100%, 20% 100%)' }} />
              <div className="absolute bottom-0 right-1/4 w-2 h-24 bg-white/5" />
              <div className="absolute bottom-0 right-1/4 w-2 h-24 bg-white/5 translate-x-4" />
              <div className="absolute bottom-0 right-1/4 w-2 h-24 bg-white/5 translate-x-8" />
            </div>
          </div>
          
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Mode badge */}
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-black/90 backdrop-blur-xl border border-emerald-500/40 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-lg shadow-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs font-black">Form Analysis:</span>
            <span className="text-white text-xs font-bold">50% Stance Accuracy</span>
          </div>
        </div>

        {/* Bottom Text - Large "Last at" label */}
        <div className="absolute bottom-8 left-6 z-10">
          <p className="text-white/70 text-sm mb-2 font-bold">Last at</p>
          <p className="text-emerald-400 text-5xl font-black leading-none tracking-tight drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]">85% <span className="text-4xl font-bold">Stance</span></p>
        </div>

        {/* Circular progress indicator */}
        <div className="absolute bottom-6 right-6 z-10">
          <div className="relative">
            {renderCircularProgress()}
            {/* Glowing effect */}
            <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
