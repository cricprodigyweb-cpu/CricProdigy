'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import CameraAnalysis from '@/components/CameraAnalysis';
import {
  ArrowLeft,
  Activity,
  Zap,
  Target,
  TrendingUp,
  Brain,
  Eye,
  Gauge,
  BarChart3,
  AlertCircle,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import {
  analyzeBattingTechnique,
  analyzeBowlingAction,
  type SkeletonData,
  type BattingAnalysis,
  type BowlingAnalysis,
} from '@/lib/mlAlgorithms';

interface AnalysisEntry {
  id: number;
  mode: string;
  timestamp: string;
  analysis: BattingAnalysis | BowlingAnalysis;
  metrics: {
    speed: number;
    power: number;
    accuracy: number;
    technique: number;
  };
}

export default function AIAnalysisPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analysisMode, setAnalysisMode] = useState<'batting' | 'bowling' | 'fielding'>('batting');
  const [currentAnalysis, setCurrentAnalysis] = useState<BattingAnalysis | BowlingAnalysis | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisEntry[]>([]);
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    speed: 0,
    power: 0,
    accuracy: 0,
    technique: 0,
  });
  const [previousSkeleton, setPreviousSkeleton] = useState<SkeletonData | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const handleCameraAnalysis = (data: { keypoints?: SkeletonData; mode?: string; timestamp?: number }) => {
    if (!data || !data.keypoints) return;

    const skeleton: SkeletonData = data.keypoints;

    // Analyze based on current mode
    if (analysisMode === 'batting') {
      const analysis = analyzeBattingTechnique(skeleton, previousSkeleton || undefined);
      setCurrentAnalysis(analysis);
      
      setRealTimeMetrics({
        speed: Math.round(analysis.backLiftAngle / 1.8),
        power: Math.round(analysis.followThroughScore),
        accuracy: Math.round(analysis.stanceScore),
        technique: Math.round(analysis.overallTechnique),
      });
    } else if (analysisMode === 'bowling') {
      const analysis = analyzeBowlingAction(skeleton, previousSkeleton || undefined);
      setCurrentAnalysis(analysis);
      
      setRealTimeMetrics({
        speed: Math.round(analysis.estimatedBallSpeed * 0.7), // Scale to 0-100
        power: Math.round(analysis.armSpeed / 2),
        accuracy: Math.round(analysis.followThroughScore),
        technique: Math.round((analysis.releaseAngle / 180) * 100),
      });
    }

    setPreviousSkeleton(skeleton);
  };

  const saveAnalysis = () => {
    if (currentAnalysis) {
      const newEntry = {
        id: Date.now(),
        mode: analysisMode,
        timestamp: new Date().toISOString(),
        analysis: currentAnalysis,
        metrics: realTimeMetrics,
      };
      setAnalysisHistory([newEntry, ...analysisHistory.slice(0, 9)]);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f1419] to-[#0a0a0a] flex items-center justify-center">
        <div className="text-white text-xl">Loading AI Analysis...</div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f1419] to-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/player-hub')}
                className="p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Brain className="h-6 w-6 text-emerald-500" />
                  AI Cricket Analysis
                </h1>
                <p className="text-emerald-400 text-sm font-medium">
                  Real-time performance tracking with ML algorithms
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">AI Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Mode Selector */}
        <div className="mb-6">
          <h2 className="text-white text-lg font-semibold mb-3">Select Analysis Mode</h2>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setAnalysisMode('batting')}
              className={`p-4 rounded-xl border-2 transition-all ${
                analysisMode === 'batting'
                  ? 'bg-emerald-500/20 border-emerald-500 shadow-lg shadow-emerald-500/20'
                  : 'bg-white/5 border-white/10 hover:border-white/30'
              }`}
            >
              <Activity className={`h-6 w-6 mx-auto mb-2 ${analysisMode === 'batting' ? 'text-emerald-500' : 'text-white/60'}`} />
              <p className={`text-sm font-medium ${analysisMode === 'batting' ? 'text-emerald-400' : 'text-white/60'}`}>
                Batting
              </p>
            </button>
            <button
              onClick={() => setAnalysisMode('bowling')}
              className={`p-4 rounded-xl border-2 transition-all ${
                analysisMode === 'bowling'
                  ? 'bg-red-500/20 border-red-500 shadow-lg shadow-red-500/20'
                  : 'bg-white/5 border-white/10 hover:border-white/30'
              }`}
            >
              <Zap className={`h-6 w-6 mx-auto mb-2 ${analysisMode === 'bowling' ? 'text-red-500' : 'text-white/60'}`} />
              <p className={`text-sm font-medium ${analysisMode === 'bowling' ? 'text-red-400' : 'text-white/60'}`}>
                Bowling
              </p>
            </button>
            <button
              onClick={() => setAnalysisMode('fielding')}
              className={`p-4 rounded-xl border-2 transition-all ${
                analysisMode === 'fielding'
                  ? 'bg-blue-500/20 border-blue-500 shadow-lg shadow-blue-500/20'
                  : 'bg-white/5 border-white/10 hover:border-white/30'
              }`}
            >
              <Target className={`h-6 w-6 mx-auto mb-2 ${analysisMode === 'fielding' ? 'text-blue-500' : 'text-white/60'}`} />
              <p className={`text-sm font-medium ${analysisMode === 'fielding' ? 'text-blue-400' : 'text-white/60'}`}>
                Fielding
              </p>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera Analysis - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <CameraAnalysis mode={analysisMode} onAnalysis={handleCameraAnalysis} />

            {/* Real-time Metrics */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white text-xl font-bold flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-emerald-500" />
                  Live Metrics
                </h3>
                <Button
                  onClick={saveAnalysis}
                  disabled={!currentAnalysis}
                  className="bg-emerald-500 hover:bg-emerald-600 text-black font-medium rounded-lg px-4 py-2"
                >
                  Save Analysis
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-xl p-4 border border-emerald-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-emerald-400 text-xs font-semibold uppercase">Speed</span>
                    <Activity className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="text-white text-3xl font-bold mb-2">{realTimeMetrics.speed}</div>
                  <Progress value={realTimeMetrics.speed} className="h-1.5 bg-white/10" />
                </div>

                <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-xl p-4 border border-red-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-red-400 text-xs font-semibold uppercase">Power</span>
                    <Zap className="h-4 w-4 text-red-400" />
                  </div>
                  <div className="text-white text-3xl font-bold mb-2">{realTimeMetrics.power}</div>
                  <Progress value={realTimeMetrics.power} className="h-1.5 bg-white/10" />
                </div>

                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl p-4 border border-blue-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-400 text-xs font-semibold uppercase">Accuracy</span>
                    <Target className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="text-white text-3xl font-bold mb-2">{realTimeMetrics.accuracy}</div>
                  <Progress value={realTimeMetrics.accuracy} className="h-1.5 bg-white/10" />
                </div>

                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl p-4 border border-purple-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-400 text-xs font-semibold uppercase">Technique</span>
                    <BarChart3 className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="text-white text-3xl font-bold mb-2">{realTimeMetrics.technique}</div>
                  <Progress value={realTimeMetrics.technique} className="h-1.5 bg-white/10" />
                </div>
              </div>
            </Card>
          </div>

          {/* Analysis Results - Right Column */}
          <div className="space-y-6">
            {/* Current Analysis */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-5 w-5 text-emerald-500" />
                <h3 className="text-white text-lg font-bold">Current Analysis</h3>
              </div>

              {currentAnalysis ? (
                <div className="space-y-4">
                  {analysisMode === 'batting' && currentAnalysis.recommendations && (
                    <>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white/60 text-sm">Stance Score</span>
                          <span className="text-white font-bold">{currentAnalysis.stanceScore?.toFixed(0)}/100</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/60 text-sm">Back Lift Angle</span>
                          <span className="text-white font-bold">{currentAnalysis.backLiftAngle?.toFixed(0)}°</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/60 text-sm">Head Stability</span>
                          <span className="text-white font-bold">{currentAnalysis.headStability?.toFixed(0)}/100</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/60 text-sm">Footwork</span>
                          <span className="text-white font-bold">{currentAnalysis.footworkScore}/100</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/10">
                        <h4 className="text-emerald-400 font-semibold text-sm mb-2 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Recommendations
                        </h4>
                        <div className="space-y-2">
                          {currentAnalysis.recommendations.map((rec: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2 text-white/70 text-xs">
                              {rec.includes('Excellent') ? (
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                              ) : (
                                <AlertCircle className="h-3.5 w-3.5 text-yellow-500 mt-0.5 flex-shrink-0" />
                              )}
                              <span>{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {analysisMode === 'bowling' && currentAnalysis.recommendations && (
                    <>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white/60 text-sm">Ball Speed</span>
                          <span className="text-white font-bold">{currentAnalysis.estimatedBallSpeed?.toFixed(0)} km/h</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/60 text-sm">Release Angle</span>
                          <span className="text-white font-bold">{currentAnalysis.releaseAngle?.toFixed(0)}°</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/60 text-sm">Action Type</span>
                          <span className="text-white font-bold">{currentAnalysis.actionType}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/60 text-sm">Arm Speed</span>
                          <span className="text-white font-bold">{currentAnalysis.armSpeed?.toFixed(0)} px/s</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/10">
                        <h4 className="text-red-400 font-semibold text-sm mb-2 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Recommendations
                        </h4>
                        <div className="space-y-2">
                          {currentAnalysis.recommendations.map((rec: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2 text-white/70 text-xs">
                              {rec.includes('Excellent') ? (
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                              ) : (
                                <AlertCircle className="h-3.5 w-3.5 text-yellow-500 mt-0.5 flex-shrink-0" />
                              )}
                              <span>{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/40 text-sm">Start camera to begin analysis</p>
                </div>
              )}
            </Card>

            {/* Analysis History */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
              <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                Recent Sessions
              </h3>

              {analysisHistory.length > 0 ? (
                <div className="space-y-3">
                  {analysisHistory.slice(0, 5).map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-white/5 rounded-lg p-3 border border-white/10 hover:border-emerald-500/50 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium text-sm capitalize">{entry.mode}</span>
                        <span className="text-white/60 text-xs">
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-xs">Technique Score</span>
                        <span className="text-emerald-400 font-bold text-sm">{entry.metrics.technique}/100</span>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10 rounded-lg mt-2"
                  >
                    View All Sessions
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/40 text-sm">No analysis history yet</p>
                  <p className="text-white/30 text-xs mt-1">Save your first analysis to see history</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
