// Cricket-specific ML algorithms and calculations

export interface PoseKeypoint {
  x: number;
  y: number;
  confidence: number;
}

export interface SkeletonData {
  nose: PoseKeypoint;
  leftEye: PoseKeypoint;
  rightEye: PoseKeypoint;
  leftEar: PoseKeypoint;
  rightEar: PoseKeypoint;
  leftShoulder: PoseKeypoint;
  rightShoulder: PoseKeypoint;
  leftElbow: PoseKeypoint;
  rightElbow: PoseKeypoint;
  leftWrist: PoseKeypoint;
  rightWrist: PoseKeypoint;
  leftHip: PoseKeypoint;
  rightHip: PoseKeypoint;
  leftKnee: PoseKeypoint;
  rightKnee: PoseKeypoint;
  leftAnkle: PoseKeypoint;
  rightAnkle: PoseKeypoint;
}

export interface BattingAnalysis {
  stanceScore: number;
  backLiftAngle: number;
  followThroughScore: number;
  footworkScore: number;
  headStability: number;
  overallTechnique: number;
  recommendations: string[];
}

export interface BowlingAnalysis {
  runUpSpeed: number;
  releaseAngle: number;
  armSpeed: number;
  shoulderRotation: number;
  followThroughScore: number;
  estimatedBallSpeed: number;
  actionType: 'Round Arm' | 'Side Arm' | 'High Arm';
  recommendations: string[];
}

export interface MovementMetrics {
  speed: number; // pixels per second
  acceleration: number;
  distance: number;
  agility: number;
}

/**
 * Calculate angle between three points
 */
export const calculateAngle = (
  a: PoseKeypoint,
  b: PoseKeypoint,
  c: PoseKeypoint
): number => {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) {
    angle = 360 - angle;
  }
  return angle;
};

/**
 * Calculate distance between two points
 */
export const calculateDistance = (
  point1: PoseKeypoint,
  point2: PoseKeypoint
): number => {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
  );
};

/**
 * Analyze batting technique from pose data
 */
export const analyzeBattingTechnique = (
  skeleton: SkeletonData,
  prevSkeleton?: SkeletonData
): BattingAnalysis => {
  const recommendations: string[] = [];
  
  // Stance Analysis - Check shoulder and hip alignment
  const shoulderAngle = Math.abs(skeleton.leftShoulder.y - skeleton.rightShoulder.y);
  const hipAngle = Math.abs(skeleton.leftHip.y - skeleton.rightHip.y);
  const stanceScore = Math.max(0, 100 - (shoulderAngle + hipAngle) * 5);
  
  if (stanceScore < 70) {
    recommendations.push("Keep your shoulders and hips more level for better balance");
  }

  // Back Lift Angle - Calculate elbow angle
  const backLiftAngle = calculateAngle(
    skeleton.rightShoulder,
    skeleton.rightElbow,
    skeleton.rightWrist
  );
  
  if (backLiftAngle < 90) {
    recommendations.push("Increase your back lift for more power");
  } else if (backLiftAngle > 150) {
    recommendations.push("Reduce excessive back lift for better control");
  }

  // Head Stability - Check vertical movement
  let headStability = 100;
  if (prevSkeleton) {
    const headMovement = Math.abs(skeleton.nose.y - prevSkeleton.nose.y);
    headStability = Math.max(0, 100 - headMovement * 2);
    
    if (headStability < 70) {
      recommendations.push("Keep your head still and eyes level while playing");
    }
  }

  // Footwork - Check knee bend and weight distribution
  const leftKneeAngle = calculateAngle(
    skeleton.leftHip,
    skeleton.leftKnee,
    skeleton.leftAnkle
  );
  const rightKneeAngle = calculateAngle(
    skeleton.rightHip,
    skeleton.rightKnee,
    skeleton.rightAnkle
  );
  
  const footworkScore = (
    (leftKneeAngle > 140 && leftKneeAngle < 180 ? 50 : 0) +
    (rightKneeAngle > 140 && rightKneeAngle < 180 ? 50 : 0)
  );

  if (footworkScore < 50) {
    recommendations.push("Bend your knees more for better footwork and balance");
  }

  // Follow Through Score
  const followThroughScore = Math.min(100, backLiftAngle * 0.6);

  // Overall Technique Score
  const overallTechnique = (
    stanceScore * 0.25 +
    (backLiftAngle / 180 * 100) * 0.25 +
    followThroughScore * 0.2 +
    footworkScore * 0.2 +
    headStability * 0.1
  );

  if (overallTechnique >= 85) {
    recommendations.push("Excellent technique! Maintain this form");
  } else if (overallTechnique < 60) {
    recommendations.push("Focus on fundamentals - practice basic drills");
  }

  return {
    stanceScore,
    backLiftAngle,
    followThroughScore,
    footworkScore,
    headStability,
    overallTechnique,
    recommendations,
  };
};

/**
 * Analyze bowling action from pose data
 */
export const analyzeBowlingAction = (
  skeleton: SkeletonData,
  prevSkeleton?: SkeletonData,
  frameDuration: number = 16.67 // milliseconds per frame (60fps)
): BowlingAnalysis => {
  const recommendations: string[] = [];
  
  // Calculate release angle at wrist
  const releaseAngle = calculateAngle(
    skeleton.rightShoulder,
    skeleton.rightElbow,
    skeleton.rightWrist
  );

  // Calculate arm speed
  let armSpeed = 0;
  if (prevSkeleton) {
    const wristDistance = calculateDistance(skeleton.rightWrist, prevSkeleton.rightWrist);
    armSpeed = (wristDistance / frameDuration) * 1000; // pixels per second
  }

  // Determine action type based on release angle
  let actionType: 'Round Arm' | 'Side Arm' | 'High Arm';
  if (releaseAngle < 120) {
    actionType = 'Round Arm';
    recommendations.push("Round arm action detected - ensure it's legal");
  } else if (releaseAngle < 150) {
    actionType = 'Side Arm';
    recommendations.push("Side arm action - work on vertical alignment");
  } else {
    actionType = 'High Arm';
    recommendations.push("Excellent high arm action!");
  }

  // Calculate shoulder rotation
  const shoulderRotation = Math.abs(skeleton.leftShoulder.x - skeleton.rightShoulder.x);

  // Calculate run-up speed (based on body displacement)
  let runUpSpeed = 0;
  if (prevSkeleton) {
    const bodyMovement = calculateDistance(
      { x: (skeleton.leftHip.x + skeleton.rightHip.x) / 2, y: (skeleton.leftHip.y + skeleton.rightHip.y) / 2, confidence: 1 },
      { x: (prevSkeleton.leftHip.x + prevSkeleton.rightHip.x) / 2, y: (prevSkeleton.leftHip.y + prevSkeleton.rightHip.y) / 2, confidence: 1 }
    );
    runUpSpeed = (bodyMovement / frameDuration) * 1000;
  }

  // Follow through score based on body alignment after release
  const followThroughScore = Math.min(100, (releaseAngle / 180) * 100);

  // Estimate ball speed (simplified model based on arm speed and release angle)
  const estimatedBallSpeed = (armSpeed * 0.15 * (releaseAngle / 180)) + 60; // km/h

  if (estimatedBallSpeed < 100) {
    recommendations.push("Increase arm speed through strength training");
  } else if (estimatedBallSpeed > 140) {
    recommendations.push("Excellent pace! Focus on accuracy now");
  }

  if (followThroughScore < 70) {
    recommendations.push("Complete your follow-through for better control");
  }

  if (runUpSpeed < 50) {
    recommendations.push("Increase run-up speed for more momentum");
  }

  return {
    runUpSpeed,
    releaseAngle,
    armSpeed,
    shoulderRotation,
    followThroughScore,
    estimatedBallSpeed,
    actionType,
    recommendations,
  };
};

/**
 * Track movement and calculate agility metrics
 */
export const calculateMovementMetrics = (
  currentSkeleton: SkeletonData,
  previousSkeletons: SkeletonData[],
  frameDuration: number = 16.67
): MovementMetrics => {
  if (previousSkeletons.length === 0) {
    return { speed: 0, acceleration: 0, distance: 0, agility: 0 };
  }

  const prevSkeleton = previousSkeletons[previousSkeletons.length - 1];
  
  // Calculate center of mass
  const currentCenter = {
    x: (currentSkeleton.leftHip.x + currentSkeleton.rightHip.x) / 2,
    y: (currentSkeleton.leftHip.y + currentSkeleton.rightHip.y) / 2,
    confidence: 1,
  };
  
  const prevCenter = {
    x: (prevSkeleton.leftHip.x + prevSkeleton.rightHip.x) / 2,
    y: (prevSkeleton.leftHip.y + prevSkeleton.rightHip.y) / 2,
    confidence: 1,
  };

  // Calculate speed
  const distance = calculateDistance(currentCenter, prevCenter);
  const speed = (distance / frameDuration) * 1000; // pixels per second

  // Calculate acceleration
  let acceleration = 0;
  if (previousSkeletons.length >= 2) {
    const prevPrevSkeleton = previousSkeletons[previousSkeletons.length - 2];
    const prevPrevCenter = {
      x: (prevPrevSkeleton.leftHip.x + prevPrevSkeleton.rightHip.x) / 2,
      y: (prevPrevSkeleton.leftHip.y + prevPrevSkeleton.rightHip.y) / 2,
      confidence: 1,
    };
    const prevDistance = calculateDistance(prevCenter, prevPrevCenter);
    const prevSpeed = (prevDistance / frameDuration) * 1000;
    acceleration = (speed - prevSpeed) / frameDuration * 1000;
  }

  // Calculate agility (based on direction changes)
  let agility = 0;
  if (previousSkeletons.length >= 3) {
    let directionChanges = 0;
    for (let i = previousSkeletons.length - 1; i >= Math.max(0, previousSkeletons.length - 10); i--) {
      if (i > 0) {
        const curr = previousSkeletons[i];
        const prev = previousSkeletons[i - 1];
        const dx1 = curr.leftHip.x - prev.leftHip.x;
        const dy1 = curr.leftHip.y - prev.leftHip.y;
        
        if (i > 1) {
          const prevPrev = previousSkeletons[i - 2];
          const dx2 = prev.leftHip.x - prevPrev.leftHip.x;
          const dy2 = prev.leftHip.y - prevPrev.leftHip.y;
          
          // Check for direction change
          const dotProduct = dx1 * dx2 + dy1 * dy2;
          if (dotProduct < 0) {
            directionChanges++;
          }
        }
      }
    }
    agility = Math.min(100, directionChanges * 20);
  }

  return {
    speed,
    acceleration,
    distance,
    agility,
  };
};

/**
 * Calculate fielding reaction metrics
 */
export const analyzeFieldingReaction = (
  skeletons: SkeletonData[],
  triggerTime: number,
  responseTime: number
): {
  reactionTime: number;
  movementSpeed: number;
  efficiency: number;
  score: number;
} => {
  const reactionTime = responseTime - triggerTime;
  
  if (skeletons.length < 2) {
    return { reactionTime, movementSpeed: 0, efficiency: 0, score: 0 };
  }

  const startSkeleton = skeletons[0];
  const endSkeleton = skeletons[skeletons.length - 1];
  
  const distance = calculateDistance(
    { x: (startSkeleton.leftHip.x + startSkeleton.rightHip.x) / 2, 
      y: (startSkeleton.leftHip.y + startSkeleton.rightHip.y) / 2, 
      confidence: 1 },
    { x: (endSkeleton.leftHip.x + endSkeleton.rightHip.x) / 2, 
      y: (endSkeleton.leftHip.y + endSkeleton.rightHip.y) / 2, 
      confidence: 1 }
  );
  
  const totalTime = skeletons.length * 16.67; // ms
  const movementSpeed = (distance / totalTime) * 1000;
  
  // Efficiency score based on reaction time and movement speed
  const efficiency = Math.min(100, (1000 / reactionTime) * 10 + movementSpeed * 0.5);
  
  // Overall fielding score
  const score = Math.min(100, efficiency * 0.7 + (distance > 50 ? 30 : 0));
  
  return {
    reactionTime,
    movementSpeed,
    efficiency,
    score,
  };
};

/**
 * Calculate shot power estimation
 */
export const calculateShotPower = (
  skeleton: SkeletonData,
  prevSkeleton: SkeletonData,
  batContact: boolean
): number => {
  if (!batContact) return 0;
  
  // Calculate bat speed (using hand/wrist velocity)
  const wristSpeed = calculateDistance(skeleton.rightWrist, prevSkeleton.rightWrist);
  
  // Calculate body rotation
  const currentRotation = Math.atan2(
    skeleton.rightShoulder.y - skeleton.leftShoulder.y,
    skeleton.rightShoulder.x - skeleton.leftShoulder.x
  );
  const prevRotation = Math.atan2(
    prevSkeleton.rightShoulder.y - prevSkeleton.leftShoulder.y,
    prevSkeleton.rightShoulder.x - prevSkeleton.leftShoulder.x
  );
  const bodyRotation = Math.abs(currentRotation - prevRotation);
  
  // Power = f(bat speed, body rotation, weight transfer)
  const power = (wristSpeed * 2) + (bodyRotation * 100);
  
  return Math.min(100, power);
};

/**
 * Detect cricket shot type
 */
export const detectShotType = (
  skeleton: SkeletonData,
  prevSkeleton: SkeletonData
): string => {
  const backLiftAngle = calculateAngle(
    skeleton.rightShoulder,
    skeleton.rightElbow,
    skeleton.rightWrist
  );
  
  const batHeight = skeleton.rightWrist.y;
  const bodyHeight = (skeleton.leftShoulder.y + skeleton.rightShoulder.y) / 2;
  
  // Detect shot based on bat position and body posture
  if (batHeight < bodyHeight - 50) {
    return "Pull Shot";
  } else if (batHeight > bodyHeight + 50) {
    return "Drive";
  } else if (backLiftAngle > 150) {
    return "Cut Shot";
  } else if (skeleton.rightWrist.x > skeleton.rightShoulder.x + 50) {
    return "Square Drive";
  } else {
    return "Defensive Shot";
  }
};
