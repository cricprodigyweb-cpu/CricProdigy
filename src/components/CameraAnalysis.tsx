'use client';

import { useRef, useEffect, useState } from 'react';
import { Camera, Video, Square, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CameraAnalysisProps {
  mode: 'batting' | 'bowling' | 'fielding';
  onAnalysis?: (data: { keypoints?: unknown; mode?: string; timestamp?: number }) => void;
}

export default function CameraAnalysis({ mode, onAnalysis }: CameraAnalysisProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string>('');
  const [fps, setFps] = useState(0);
  const [detectionActive, setDetectionActive] = useState(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number>();
  const lastFrameTimeRef = useRef<number>(0);

  // Start camera stream
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        mediaStreamRef.current = stream;
        setIsStreaming(true);
        setError('');
        startDetection();
      }
    } catch (err) {
      setError('Failed to access camera. Please grant camera permissions.');
      console.error('Camera error:', err);
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    stopDetection();
  };

  // Start recording
  const startRecording = () => {
    if (!mediaStreamRef.current) return;

    recordedChunksRef.current = [];
    const mediaRecorder = new MediaRecorder(mediaStreamRef.current, {
      mimeType: 'video/webm',
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      // You can download or upload the video here
      console.log('Recording saved:', url);
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Pose detection loop
  const startDetection = () => {
    setDetectionActive(true);
    detectPose();
  };

  const stopDetection = () => {
    setDetectionActive(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const detectPose = () => {
    if (!detectionActive || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationFrameRef.current = requestAnimationFrame(detectPose);
      return;
    }

    // Calculate FPS
    const timeDiff = Date.now() - lastFrameTimeRef.current;
    if (timeDiff > 0) {
      setFps(Math.round(1000 / timeDiff));
    }
    lastFrameTimeRef.current = Date.now();

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Here you would integrate with TensorFlow.js PoseNet or MediaPipe
    // For now, we'll draw a skeleton overlay as a placeholder
    drawPlaceholderSkeleton(ctx, canvas.width, canvas.height);

    // Mock pose data for demonstration
    const mockPoseData = {
      mode,
      timestamp: Date.now(),
      keypoints: generateMockKeypoints(canvas.width, canvas.height),
    };

    if (onAnalysis) {
      onAnalysis(mockPoseData);
    }

    animationFrameRef.current = requestAnimationFrame(detectPose);
  };

  // Draw placeholder skeleton overlay
  const drawPlaceholderSkeleton = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    const centerX = width / 2;
    const centerY = height / 2;

    // Draw skeleton overlay
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#10B981';

    // Draw pose tracking indicators
    ctx.beginPath();
    ctx.arc(centerX, centerY - 100, 8, 0, 2 * Math.PI); // Head
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX - 60, centerY, 8, 0, 2 * Math.PI); // Left shoulder
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX + 60, centerY, 8, 0, 2 * Math.PI); // Right shoulder
    ctx.fill();

    // Draw connecting lines
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 100);
    ctx.lineTo(centerX, centerY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX - 60, centerY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + 60, centerY);
    ctx.stroke();

    // Draw tracking box
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(width * 0.2, height * 0.1, width * 0.6, height * 0.8);
    ctx.setLineDash([]);

    // Draw mode indicator
    ctx.font = 'bold 24px Inter';
    ctx.fillStyle = '#10B981';
    ctx.fillText(`${mode.toUpperCase()} MODE`, 20, 40);

    // Draw FPS counter
    ctx.font = '16px Inter';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`FPS: ${fps}`, width - 80, 30);
  };

  // Generate mock keypoints for demonstration
  const generateMockKeypoints = (width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    
    return {
      nose: { x: centerX, y: centerY - 100, confidence: 0.9 },
      leftShoulder: { x: centerX - 60, y: centerY, confidence: 0.9 },
      rightShoulder: { x: centerX + 60, y: centerY, confidence: 0.9 },
      leftElbow: { x: centerX - 80, y: centerY + 60, confidence: 0.85 },
      rightElbow: { x: centerX + 80, y: centerY + 60, confidence: 0.85 },
      leftWrist: { x: centerX - 90, y: centerY + 120, confidence: 0.8 },
      rightWrist: { x: centerX + 90, y: centerY + 120, confidence: 0.8 },
      leftHip: { x: centerX - 40, y: centerY + 100, confidence: 0.9 },
      rightHip: { x: centerX + 40, y: centerY + 100, confidence: 0.9 },
      leftKnee: { x: centerX - 50, y: centerY + 180, confidence: 0.85 },
      rightKnee: { x: centerX + 50, y: centerY + 180, confidence: 0.85 },
      leftAnkle: { x: centerX - 45, y: centerY + 260, confidence: 0.8 },
      rightAnkle: { x: centerX + 45, y: centerY + 260, confidence: 0.8 },
    };
  };

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Camera className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-white text-lg font-bold">Live Camera Analysis</h3>
              <p className="text-white/60 text-sm capitalize">{mode} Mode Active</p>
            </div>
          </div>
          {isRecording && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-full">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 text-xs font-medium">Recording</span>
            </div>
          )}
        </div>

        {/* Camera Feed */}
        <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
          {!isStreaming && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-black/90 to-black/70">
              <Video className="h-16 w-16 text-white/40" />
              <Button
                onClick={startCamera}
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-medium rounded-full px-6 py-3"
              >
                <Camera className="h-4 w-4 mr-2" />
                Start Camera
              </Button>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-red-500/20 to-black/70">
              <p className="text-red-400 text-center px-4">{error}</p>
              <Button
                onClick={startCamera}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          )}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ display: isStreaming ? 'block' : 'none' }}
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ display: isStreaming ? 'block' : 'none' }}
          />

          {/* Tracking Overlay Info */}
          {isStreaming && (
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-2 bg-black/60 backdrop-blur-sm rounded-lg border border-white/10">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-white text-xs font-medium">AI Tracking Active</span>
              </div>
              <div className="px-3 py-2 bg-black/60 backdrop-blur-sm rounded-lg border border-white/10">
                <span className="text-white text-xs font-mono">{fps} FPS</span>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        {isStreaming && (
          <div className="flex items-center gap-3 flex-wrap">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                className="bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg px-4 py-2 flex items-center gap-2"
              >
                <Square className="h-4 w-4 fill-current" />
                Start Recording
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                className="bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg px-4 py-2 flex items-center gap-2"
              >
                <Square className="h-4 w-4" />
                Stop Recording
              </Button>
            )}

            <Button
              onClick={isPaused ? () => setIsPaused(false) : () => setIsPaused(true)}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 rounded-lg px-4 py-2 flex items-center gap-2"
            >
              {isPaused ? (
                <>
                  <Play className="h-4 w-4" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4" />
                  Pause
                </>
              )}
            </Button>

            <Button
              onClick={stopCamera}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 rounded-lg px-4 py-2 flex items-center gap-2"
            >
              <Camera className="h-4 w-4" />
              Stop Camera
            </Button>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
          <h4 className="text-emerald-400 font-semibold mb-2 text-sm">
            {mode === 'batting' && '🏏 Batting Analysis Tips'}
            {mode === 'bowling' && '⚡ Bowling Analysis Tips'}
            {mode === 'fielding' && '🎯 Fielding Analysis Tips'}
          </h4>
          <ul className="text-white/70 text-xs space-y-1">
            {mode === 'batting' && (
              <>
                <li>• Position yourself in the center of the frame</li>
                <li>• Show your complete batting stance and follow-through</li>
                <li>• Ensure good lighting for better tracking</li>
              </>
            )}
            {mode === 'bowling' && (
              <>
                <li>• Capture your complete bowling action from the side</li>
                <li>• Include your run-up, delivery, and follow-through</li>
                <li>• Maintain consistent distance from camera</li>
              </>
            )}
            {mode === 'fielding' && (
              <>
                <li>• Demonstrate fielding techniques clearly</li>
                <li>• Show catching, diving, and throwing motions</li>
                <li>• Ensure full body is visible in frame</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </Card>
  );
}
