'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';

const questions = [
  {
    id: 1,
    category: 'Cricket',
    question: 'What is your primary playing role?',
    type: 'single',
    options: [
      { value: 'batsman', label: 'Batsman', desc: 'Score runs and anchor innings' },
      { value: 'bowler', label: 'Bowler', desc: 'Take wickets and control runs' },
      { value: 'all-rounder', label: 'All-rounder', desc: 'Contribute with bat and ball' },
      { value: 'wicket-keeper', label: 'Wicket Keeper', desc: 'Keep wickets and bat' },
    ],
  },
  {
    id: 2,
    category: 'Cricket',
    question: 'What is your skill level?',
    type: 'single',
    options: [
      { value: 'beginner', label: 'Beginner', desc: 'Just starting out' },
      { value: 'intermediate', label: 'Intermediate', desc: 'Some experience' },
      { value: 'advanced', label: 'Advanced', desc: 'Competitive player' },
      { value: 'professional', label: 'Professional', desc: 'Playing at high level' },
    ],
  },
  {
    id: 3,
    category: 'Cricket',
    question: 'Which areas do you want to improve?',
    type: 'multiple',
    options: [
      { value: 'batting', label: 'Batting Technique' },
      { value: 'bowling', label: 'Bowling Skills' },
      { value: 'fielding', label: 'Fielding' },
      { value: 'fitness', label: 'Physical Fitness' },
      { value: 'mental', label: 'Mental Game' },
      { value: 'strategy', label: 'Game Strategy' },
    ],
  },
  {
    id: 4,
    category: 'Fitness',
    question: 'How often do you currently train?',
    type: 'single',
    options: [
      { value: '0-1', label: '0-1 times/week', desc: 'Rarely' },
      { value: '2-3', label: '2-3 times/week', desc: 'Occasionally' },
      { value: '4-5', label: '4-5 times/week', desc: 'Regularly' },
      { value: '6+', label: '6+ times/week', desc: 'Very frequently' },
    ],
  },
  {
    id: 5,
    category: 'Fitness',
    question: 'What are your fitness goals?',
    type: 'multiple',
    options: [
      { value: 'strength', label: 'Build Strength' },
      { value: 'endurance', label: 'Improve Endurance' },
      { value: 'flexibility', label: 'Increase Flexibility' },
      { value: 'speed', label: 'Enhance Speed' },
      { value: 'agility', label: 'Better Agility' },
      { value: 'weight', label: 'Weight Management' },
    ],
  },
  {
    id: 6,
    category: 'Goals',
    question: 'What do you want to achieve with CricProdigy?',
    type: 'multiple',
    options: [
      { value: 'professional', label: 'Become a professional player' },
      { value: 'team', label: 'Get selected for a team' },
      { value: 'fitness', label: 'Improve overall fitness' },
      { value: 'skills', label: 'Master specific skills' },
      { value: 'knowledge', label: 'Learn cricket strategies' },
      { value: 'fun', label: 'Play for fun and health' },
    ],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentStep];
  const isLastQuestion = currentStep === questions.length - 1;
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleSelect = (value: string) => {
    if (currentQuestion.type === 'single') {
      setAnswers({ ...answers, [currentQuestion.id]: value });
    } else {
      const current = (answers[currentQuestion.id] as string[]) || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      setAnswers({ ...answers, [currentQuestion.id]: updated });
    }
  };

  const isSelected = (value: string) => {
    const answer = answers[currentQuestion.id];
    if (Array.isArray(answer)) {
      return answer.includes(value);
    }
    return answer === value;
  };

  const canProceed = () => {
    const answer = answers[currentQuestion.id];
    if (currentQuestion.type === 'single') {
      return !!answer;
    } else {
      return Array.isArray(answer) && answer.length > 0;
    }
  };

  const handleNext = () => {
    if (!canProceed()) return;

    if (isLastQuestion) {
      handleSubmit();
    } else {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Save onboarding data to database
      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          userId: session?.user?.id,
        }),
      });

      if (response.ok) {
        router.push('/player-hub');
      } else {
        throw new Error('Failed to save onboarding data');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      // Still redirect to hub even if save fails
      router.push('/player-hub');
    }
  };

  const getCardStyle = (index: number) => {
    const diff = index - currentStep;
    
    // All non-active cards stay at center, invisible, ready to animate in
    if (diff !== 0) {
      return {
        opacity: 0,
        scale: 0.95,
        y: 0,
        x: 0,
        zIndex: index < currentStep ? index : 999 - diff,
        rotateZ: 0,
      };
    }
    
    // Current active card - front and center
    return {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
      zIndex: 1000,
      rotateZ: 0,
    };
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-black to-purple-900/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(16,185,129,0.15),transparent_50%)]"></div>
      <motion.div 
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ 
            duration: 8,
            delay: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
      </motion.div>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Skip button */}
      <button
        onClick={() => router.push('/player-hub')}
        className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors text-sm"
      >
        Skip for now
      </button>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-3xl">

        {/* Question cards - Stacked */}
        <div className="relative h-[480px] md:h-[520px] perspective-1000">
          <AnimatePresence mode="wait" initial={false}>
            {questions.map((question, index) => {
              const isActive = index === currentStep;
              
              if (!isActive) return null;
              
              return (
                <motion.div
                  key={question.id}
                  initial={{
                    x: direction > 0 ? 400 : -400,
                    opacity: 0,
                    scale: 0.9,
                    rotateZ: direction > 0 ? 15 : -15,
                  }}
                  animate={{
                    x: 0,
                    opacity: 1,
                    scale: 1,
                    rotateZ: 0,
                  }}
                  exit={{
                    x: direction > 0 ? -400 : 400,
                    opacity: 0,
                    scale: 0.9,
                    rotateZ: direction > 0 ? -15 : 15,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: [0.68, -0.15, 0.265, 1.15],
                  }}
                  className="absolute inset-0 origin-center will-change-transform"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                >
              <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-2xl border-2 border-white/20 rounded-3xl p-5 md:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.6)] h-full flex flex-col relative overflow-hidden transform-gpu">
                {/* Decorative gradient overlay */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  {/* Category badge and progress */}
                  <motion.div 
                    className="flex items-center gap-3 mb-6"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <span className="px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/40 shadow-lg shadow-emerald-500/20">
                      {question.category}
                    </span>
                    <span className="text-gray-400 text-xs font-semibold">
                      <span className="text-emerald-400">{index + 1}</span> of {questions.length}
                    </span>
                  </motion.div>

                  {/* Question */}
                  <motion.h2 
                    className="text-xl md:text-2xl font-bold text-white mb-6 leading-tight"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                  >
                    {question.question}
                  </motion.h2>

                  {/* Options */}
                  <div className="flex-1 overflow-y-auto mb-5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent scroll-smooth">
                    <div className="grid gap-2.5 grid-cols-1">
                      {question.options.map((option, optIndex) => (
                        <motion.button
                          key={option.value}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ 
                            opacity: 1, 
                            y: 0,
                          }}
                          transition={{ 
                            duration: 0.3, 
                            delay: 0.2 + optIndex * 0.05,
                            type: 'spring',
                            stiffness: 300,
                            damping: 24,
                          }}
                          whileHover={{ 
                            scale: 1.02, 
                            y: -4,
                            transition: { duration: 0.2, ease: 'easeOut' }
                          }}
                          whileTap={{ 
                            scale: 0.98,
                            transition: { duration: 0.1 }
                          }}
                          onClick={() => handleSelect(option.value)}
                          className={`relative p-3.5 rounded-xl border-2 transition-all duration-300 ease-out text-left group ${
                            isSelected(option.value)
                              ? 'border-emerald-500 bg-gradient-to-br from-emerald-500/20 to-emerald-400/10 shadow-lg shadow-emerald-500/20'
                              : 'border-white/10 bg-white/5 hover:border-emerald-500/50 hover:bg-white/10 hover:shadow-md hover:shadow-emerald-500/10'
                          } cursor-pointer`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1">
                              <p className="text-white font-semibold text-sm mb-0.5">
                                {option.label}
                              </p>
                              {option.desc && (
                                <p className="text-gray-400 text-xs">
                                  {option.desc}
                                </p>
                              )}
                            </div>
                            {isSelected(option.value) && (
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                                className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50"
                              >
                                <Check className="w-3.5 h-3.5 text-black font-bold" strokeWidth={3} />
                              </motion.div>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Navigation */}
                  <motion.div 
                    className="flex items-center justify-between gap-3 pt-4 border-t border-white/10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.25 }}
                  >
                    <Button
                      onClick={handleBack}
                      disabled={currentStep === 0}
                      variant="outline"
                      className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white rounded-xl px-5 py-2 text-sm disabled:opacity-30 transition-all"
                    >
                      <ChevronLeft className="mr-1.5 h-4 w-4" />
                      Back
                    </Button>

                    <Button
                      onClick={handleNext}
                      disabled={!canProceed() || isSubmitting}
                      className="bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-bold rounded-xl px-6 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40"
                    >
                      {isSubmitting ? (
                        'Saving...'
                      ) : isLastQuestion ? (
                        <>
                          Complete
                          <Check className="ml-1.5 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Next
                          <ChevronRight className="ml-1.5 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
