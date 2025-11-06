'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { DotsIcon } from '@/components/Icons';

// Types and Interfaces
interface DataPoint {
  x: number;
  y: number;
  label: string;
  value: number;
}

interface ChartMetrics {
  min: number;
  max: number;
  average: number;
  trend: 'up' | 'down' | 'stable';
}

interface AnimationState {
  progress: number;
  isComplete: boolean;
}

// Constants
const CHART_CONFIG = {
  height: 280,
  width: 600,
  padding: { top: 20, right: 20, bottom: 40, left: 40 },
  animationDuration: 1500,
  hoverDelay: 200,
};

const Y_AXIS_LABELS = ['18', '10', '5', '0'];
const X_AXIS_LABELS = ['14', '13', '75', '01', '57', '81', '91', '108'];

// Utility Functions
const interpolate = (start: number, end: number, progress: number): number => {
  return start + (end - start) * progress;
};

const easeOutCubic = (t: number): number => {
  return 1 - Math.pow(1 - t, 3);
};

const calculateMetrics = (data: DataPoint[]): ChartMetrics => {
  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const average = values.reduce((a, b) => a + b, 0) / values.length;
  
  const firstHalf = values.slice(0, Math.floor(values.length / 2));
  const secondHalf = values.slice(Math.floor(values.length / 2));
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (secondAvg > firstAvg * 1.1) trend = 'up';
  else if (secondAvg < firstAvg * 0.9) trend = 'down';
  
  return { min, max, average, trend };
};

const generateGradientId = (type: string): string => {
  return `gradient-${type}-${Math.random().toString(36).substr(2, 9)}`;
};

// Main Component
export default function WeeklyProgress() {
  // State Management
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'batting' | 'bowling' | 'both'>('both');
  const [animationState, setAnimationState] = useState<AnimationState>({
    progress: 0,
    isComplete: false,
  });
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isChartVisible, setIsChartVisible] = useState(false);
  const [chartDimensions, setChartDimensions] = useState({
    width: CHART_CONFIG.width,
    height: CHART_CONFIG.height,
  });

  // Refs
  const chartRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();

  // Data Configuration
  const battingData: DataPoint[] = useMemo(() => [
    { x: 0, y: 220, label: '14', value: 8 },
    { x: 75, y: 200, label: '13', value: 10 },
    { x: 150, y: 180, label: '75', value: 12 },
    { x: 225, y: 140, label: '01', value: 16 },
    { x: 300, y: 160, label: '57', value: 14 },
    { x: 375, y: 120, label: '81', value: 18 },
    { x: 450, y: 140, label: '91', value: 16 },
    { x: 525, y: 100, label: '108', value: 20 },
    { x: 600, y: 80, label: '', value: 22 },
  ], []);

  const bowlingData: DataPoint[] = useMemo(() => [
    { x: 0, y: 240, label: '14', value: 6 },
    { x: 75, y: 210, label: '13', value: 9 },
    { x: 150, y: 195, label: '75', value: 10 },
    { x: 225, y: 180, label: '01', value: 12 },
    { x: 300, y: 165, label: '57', value: 13 },
    { x: 375, y: 150, label: '81', value: 15 },
    { x: 450, y: 157, label: '91', value: 14 },
    { x: 525, y: 142, label: '108', value: 16 },
    { x: 600, y: 120, label: '', value: 18 },
  ], []);

  // Computed Values
  const metrics = useMemo(() => ({
    batting: calculateMetrics(battingData),
    bowling: calculateMetrics(bowlingData),
  }), [battingData, bowlingData]);

  const gradientIds = useMemo(() => ({
    area: generateGradientId('area'),
    line: generateGradientId('line'),
  }), []);

  // Path Generation
  const generatePath = (data: DataPoint[], type: 'line' | 'area' = 'line'): string => {
    if (data.length === 0) return '';
    
    const points = data.map((point, idx) => {
      const animatedY = interpolate(
        CHART_CONFIG.height,
        point.y,
        easeOutCubic(animationState.progress)
      );
      return `${idx === 0 ? 'M' : 'L'} ${point.x},${animatedY}`;
    });

    if (type === 'area') {
      points.push(`L ${data[data.length - 1].x},${CHART_CONFIG.height}`);
      points.push(`L 0,${CHART_CONFIG.height}`);
      points.push('Z');
    }

    return points.join(' ');
  };

  // Animation Effect
  useEffect(() => {
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / CHART_CONFIG.animationDuration, 1);
      
      setAnimationState({
        progress,
        isComplete: progress === 1,
      });

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    if (isChartVisible) {
      animate();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isChartVisible]);

  // Visibility Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsChartVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => {
      if (chartRef.current) {
        observer.unobserve(chartRef.current);
      }
    };
  }, []);

  // Resize Handler
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        const { width } = chartRef.current.getBoundingClientRect();
        setChartDimensions({
          width: Math.min(width - 64, CHART_CONFIG.width),
          height: CHART_CONFIG.height,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Event Handlers
  const handlePointHover = (index: number, event: React.MouseEvent) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredPoint(index);
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    }, CHART_CONFIG.hoverDelay);
  };

  const handlePointLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredPoint(null);
  };

  const toggleMetric = (metric: 'batting' | 'bowling') => {
    if (selectedMetric === metric) {
      setSelectedMetric('both');
    } else if (selectedMetric === 'both') {
      setSelectedMetric(metric);
    } else {
      setSelectedMetric('both');
    }
  };

  // Render Helpers
  const renderGridLines = () => (
    <g className="grid-lines">
      {[0, 70, 140, 210, 280].map((y, idx) => (
        <line
          key={`grid-${y}`}
          x1="0"
          y1={y}
          x2="600"
          y2={y}
          stroke="rgba(255,255,255,0.03)"
          strokeWidth="1"
          className="transition-opacity duration-500"
          style={{
            opacity: animationState.isComplete ? 1 : 0,
            transitionDelay: `${idx * 100}ms`,
          }}
        />
      ))}
    </g>
  );

  const renderDataPoints = (data: DataPoint[], color: string, offset: number = 0) => (
    <g className="data-points">
      {data.map((point, idx) => {
        const animatedY = interpolate(
          CHART_CONFIG.height,
          point.y,
          easeOutCubic(animationState.progress)
        );
        const isHovered = hoveredPoint === idx + offset;
        
        return (
          <circle
            key={`point-${idx}-${offset}`}
            cx={point.x}
            cy={animatedY}
            r={isHovered ? 6 : 4}
            fill={color}
            className="cursor-pointer transition-all duration-200"
            style={{
              opacity: animationState.progress > (idx / data.length) ? 0.9 : 0,
              filter: isHovered ? `drop-shadow(0 0 8px ${color})` : 'none',
            }}
            onMouseEnter={(e) => handlePointHover(idx + offset, e)}
            onMouseLeave={handlePointLeave}
          />
        );
      })}
    </g>
  );

  const renderAnnotation = () => {
    const annotationIndex = 5;
    const point = battingData[annotationIndex];
    const animatedY = interpolate(
      CHART_CONFIG.height,
      point.y,
      easeOutCubic(animationState.progress)
    );

    return (
      <g
        className="annotation"
        style={{
          opacity: animationState.isComplete ? 1 : 0,
          transition: 'opacity 0.5s ease-out 1s',
        }}
      >
        <line
          x1={point.x}
          y1={animatedY}
          x2={point.x}
          y2="40"
          stroke="#10b981"
          strokeWidth="1.5"
          strokeDasharray="4,4"
          opacity="0.6"
        />
        <circle cx={point.x} cy={animatedY} r="4" fill="#10b981" />
        <text
          x={point.x + 10}
          y="50"
          fill="#10b981"
          fontSize="14"
          fontWeight="700"
          className="select-none"
        >
          Bowling Rate
        </text>
      </g>
    );
  };

  const renderTooltip = () => {
    if (hoveredPoint === null) return null;

    const data = hoveredPoint < battingData.length ? battingData : bowlingData;
    const index = hoveredPoint % battingData.length;
    const point = data[index];

    return (
      <div
        className="fixed z-50 bg-black/90 backdrop-blur-xl border border-lime-500/30 rounded-lg px-4 py-2 shadow-2xl pointer-events-none transform -translate-x-1/2 -translate-y-full -mt-2"
        style={{
          left: tooltipPosition.x,
          top: tooltipPosition.y,
          animation: 'fadeIn 0.2s ease-out',
        }}
      >
        <p className="text-emerald-400 text-xs font-bold">
          Week {point.label || index + 1}
        </p>
        <p className="text-white text-sm font-black">{point.value} sessions</p>
      </div>
    );
  };

  const renderLegend = () => (
    <div className="flex items-center gap-6">
      <button
        onClick={() => toggleMetric('batting')}
        className={`flex items-center gap-2 transition-all duration-300 ${
          selectedMetric === 'batting' || selectedMetric === 'both'
            ? 'opacity-100'
            : 'opacity-40 hover:opacity-60'
        }`}
      >
        <div
          className={`w-8 h-0.5 rounded-full transition-all duration-300 ${
            selectedMetric === 'batting' || selectedMetric === 'both'
              ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50'
              : 'bg-emerald-400/50'
          }`}
        />
        <span className="text-white font-bold text-sm">Baiting Average</span>
      </button>
      <button
        onClick={() => toggleMetric('bowling')}
        className={`flex items-center gap-2 transition-all duration-300 ${
          selectedMetric === 'bowling' || selectedMetric === 'both'
            ? 'opacity-100'
            : 'opacity-40 hover:opacity-60'
        }`}
      >
        <div
          className={`w-8 h-0.5 rounded-full transition-all duration-300 ${
            selectedMetric === 'bowling' || selectedMetric === 'both'
              ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50'
              : 'bg-emerald-400/50'
          }`}
        />
        <span className="text-white font-bold text-sm">Bowling Rate</span>
      </button>
    </div>
  );

  // Main Render
  return (
    <div
      ref={chartRef}
      className="bg-black rounded-3xl p-6 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-500"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-xl font-black mb-4 tracking-tight">Weekly Training Progress</h2>
          {renderLegend()}
        </div>
        <button className="text-white/40 hover:text-emerald-400 transition-colors p-2 hover:bg-emerald-500/10 rounded-lg">
          <DotsIcon />
        </button>
      </div>

      {/* Chart Area */}
      <div className="relative h-72 bg-gradient-to-br from-emerald-950/30 via-black to-black rounded-2xl px-4 py-6 border border-emerald-500/10">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-12 flex flex-col justify-between text-white/40 text-xs font-medium">
          {Y_AXIS_LABELS.map((label, idx) => (
            <span
              key={`y-${label}`}
              className="transition-opacity duration-500"
              style={{
                opacity: isChartVisible ? 1 : 0,
                transitionDelay: `${idx * 100}ms`,
              }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Chart SVG */}
        <svg
          className="w-full h-full pl-8"
          viewBox="0 0 600 280"
          preserveAspectRatio="none"
          onMouseLeave={handlePointLeave}
        >
          <defs>
            <linearGradient id={gradientIds.area} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(16, 185, 129)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(16, 185, 129)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id={gradientIds.line} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#34d399" stopOpacity="1" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {renderGridLines()}

          {/* Area fill */}
          {(selectedMetric === 'bowling' || selectedMetric === 'both') && (
            <path
              d={generatePath(battingData, 'area')}
              fill={`url(#${gradientIds.area})`}
              className="transition-opacity duration-500"
            />
          )}

          {/* Chart lines */}
          {(selectedMetric === 'bowling' || selectedMetric === 'both') && (
            <path
              d={generatePath(battingData, 'line')}
              fill="none"
              stroke={`url(#${gradientIds.line})`}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-500"
            />
          )}

          {renderAnnotation()}
          
          {(selectedMetric === 'batting' || selectedMetric === 'both') &&
            renderDataPoints(battingData, '#a3e635', 0)}
          
          {(selectedMetric === 'bowling' || selectedMetric === 'both') &&
            renderDataPoints(bowlingData, '#84cc16', 100)}
        </svg>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-8 right-0 flex justify-between text-white/40 text-xs pt-2 font-medium">
          {X_AXIS_LABELS.map((label, idx) => (
            <span
              key={`x-${label}`}
              className="transition-opacity duration-500 hover:text-emerald-400 cursor-default font-semibold"
              style={{
                opacity: isChartVisible ? 1 : 0,
                transitionDelay: `${idx * 50}ms`,
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {renderTooltip()}
    </div>
  );
}
