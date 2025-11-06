'use client';

import { useState, useEffect, useRef } from 'react';
import { UtensilsIcon, DotsIcon, PlusIcon, CheckIcon } from '@/components/Icons';

// Types and Interfaces
interface Meal {
  id: string;
  name: string;
  emoji: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  isCompleted: boolean;
  items: string[];
  prepTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface NutritionTarget {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface DailyProgress {
  consumed: NutritionTarget;
  target: NutritionTarget;
}

// Constants
const INITIAL_MEALS: Meal[] = [
  {
    id: '1',
    name: 'Breakfast',
    emoji: '🥚',
    time: '7:00 AM',
    calories: 520,
    protein: 35,
    carbs: 48,
    fats: 18,
    isCompleted: false,
    items: ['Oriamble with Cirla Seeds'],
    prepTime: 15,
    difficulty: 'easy',
  },
  {
    id: '2',
    name: 'Lunch',
    emoji: '🍗',
    time: '1:00 PM',
    calories: 680,
    protein: 52,
    carbs: 65,
    fats: 22,
    isCompleted: true,
    items: ['Grinea Chicken Salad'],
    prepTime: 25,
    difficulty: 'medium',
  },
  {
    id: '3',
    name: 'Lunch',
    emoji: '🍗',
    time: '1:00 PM',
    calories: 680,
    protein: 52,
    carbs: 65,
    fats: 22,
    isCompleted: true,
    items: ['Grinea Chicken Salad'],
    prepTime: 25,
    difficulty: 'medium',
  },
  {
    id: '4',
    name: 'Dinner',
    emoji: '🥗',
    time: '7:30 PM',
    calories: 750,
    protein: 48,
    carbs: 72,
    fats: 28,
    isCompleted: true,
    items: ['Olones with Vegetables'],
    prepTime: 30,
    difficulty: 'medium',
  },
  {
    id: '5',
    name: 'Dinner',
    emoji: '🥬',
    time: '7:30 PM',
    calories: 750,
    protein: 48,
    carbs: 72,
    fats: 28,
    isCompleted: false,
    items: ['Quined with Vegetables'],
    prepTime: 30,
    difficulty: 'medium',
  },
];

const NUTRITION_TARGETS: NutritionTarget = {
  calories: 2500,
  protein: 180,
  carbs: 246,
  fats: 87,
};

// Main Component
export default function DietPlan() {
  // State Management
  const [meals, setMeals] = useState<Meal[]>(INITIAL_MEALS);
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [dailyProgress, setDailyProgress] = useState<DailyProgress>({
    consumed: { calories: 0, protein: 0, carbs: 0, fats: 0 },
    target: NUTRITION_TARGETS,
  });
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [animatingMeal, setAnimatingMeal] = useState<string | null>(null);
  const [hoveredMeal, setHoveredMeal] = useState<string | null>(null);
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [waterIntake, setWaterIntake] = useState(5);
  const [waterTarget] = useState(8);

  // Refs
  const mealRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Calculate daily progress
  useEffect(() => {
    const consumed = meals.reduce(
      (acc, meal) => {
        if (meal.isCompleted) {
          return {
            calories: acc.calories + meal.calories,
            protein: acc.protein + meal.protein,
            carbs: acc.carbs + meal.carbs,
            fats: acc.fats + meal.fats,
          };
        }
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    setDailyProgress({ consumed, target: NUTRITION_TARGETS });
  }, [meals]);

  // Event Handlers
  const toggleMealComplete = (mealId: string) => {
    setAnimatingMeal(mealId);
    
    setTimeout(() => {
      setMeals((prevMeals) =>
        prevMeals.map((meal) =>
          meal.id === mealId ? { ...meal, isCompleted: !meal.isCompleted } : meal
        )
      );
      setAnimatingMeal(null);
    }, 300);
  };

  const handleMealClick = (mealId: string) => {
    if (selectedMeal === mealId) {
      setSelectedMeal(null);
    } else {
      setSelectedMeal(mealId);
    }
  };

  const handleMealHover = (mealId: string) => {
    setHoveredMeal(mealId);
  };

  const handleMealLeave = () => {
    setHoveredMeal(null);
  };

  const toggleExpandMeal = (mealId: string) => {
    if (expandedMeal === mealId) {
      setExpandedMeal(null);
    } else {
      setExpandedMeal(mealId);
    }
  };

  const incrementWater = () => {
    if (waterIntake < waterTarget) {
      setWaterIntake((prev) => prev + 1);
    }
  };

  // Render Helpers
  const renderProgressRing = (value: number, max: number, color: string) => {
    const percentage = (value / max) * 100;
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="6"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
    );
  };

  const renderNutritionStats = () => {
    const stats = [
      {
        label: 'Calories',
        value: dailyProgress.consumed.calories,
        max: dailyProgress.target.calories,
        color: '#a3e635',
        unit: 'kcal',
      },
      {
        label: 'Protein',
        value: dailyProgress.consumed.protein,
        max: dailyProgress.target.protein,
        color: '#84cc16',
        unit: 'g',
      },
      {
        label: 'Carbs',
        value: dailyProgress.consumed.carbs,
        max: dailyProgress.target.carbs,
        color: '#bef264',
        unit: 'g',
      },
      {
        label: 'Fats',
        value: dailyProgress.consumed.fats,
        max: dailyProgress.target.fats,
        color: '#d9f99d',
        unit: 'g',
      },
    ];

    return (
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="relative bg-gradient-to-br from-white/5 to-white/0 rounded-2xl p-4 border border-white/10 hover:border-lime-500/30 transition-all duration-300 group"
            style={{
              animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
            }}
          >
            <div className="flex flex-col items-center">
              <div className="relative">
                {renderProgressRing(stat.value, stat.max, stat.color)}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {Math.round((stat.value / stat.max) * 100)}%
                  </span>
                </div>
              </div>
              <p className="text-white/60 text-xs mt-2 font-medium">{stat.label}</p>
              <p className="text-white text-sm font-bold">
                {stat.value}/{stat.max}
                <span className="text-white/40 text-xs ml-1">{stat.unit}</span>
              </p>
            </div>
            
            {/* Hover effect */}
            <div className="absolute inset-0 bg-lime-500/0 group-hover:bg-lime-500/5 rounded-2xl transition-all duration-300" />
          </div>
        ))}
      </div>
    );
  };

  const renderMealCard = (meal: Meal, index: number) => {
    const isHovered = hoveredMeal === meal.id;

    return (
      <div
        key={meal.id}
        className={`relative rounded-2xl p-5 border transition-all duration-300 cursor-pointer min-h-[110px] flex flex-col justify-between ${
          meal.isCompleted
            ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 border-emerald-400 shadow-lg shadow-emerald-500/50'
            : 'bg-zinc-900/50 border-emerald-500/20 hover:border-emerald-500/40'
        }`}
        onClick={() => toggleMealComplete(meal.id)}
        onMouseEnter={() => handleMealHover(meal.id)}
        onMouseLeave={handleMealLeave}
      >
        {/* Meal name and description */}
        <div className="pr-12">
          <h4
            className={`font-black text-base mb-1 ${
              meal.isCompleted ? 'text-black' : 'text-white'
            }`}
          >
            {meal.name}:
          </h4>
          <p
            className={`text-sm leading-tight font-semibold ${
              meal.isCompleted ? 'text-black/90' : 'text-white/80'
            }`}
          >
            {meal.items[0]}
          </p>
        </div>

        {/* Food emoji/image */}
        <div className="absolute bottom-3 right-3">
          <div
            className={`text-4xl transform transition-transform duration-300 ${
              isHovered ? 'scale-110' : ''
            }`}
          >
            {meal.emoji}
          </div>
        </div>
      </div>
    );
  };

  const renderWaterTracker = () => (
    <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-2xl p-4 border border-blue-500/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💧</span>
          <div>
            <h4 className="text-white font-semibold text-sm">Water Intake</h4>
            <p className="text-white/40 text-xs">
              {waterIntake}/{waterTarget} glasses
            </p>
          </div>
        </div>
        <button
          onClick={incrementWater}
          disabled={waterIntake >= waterTarget}
          className="w-8 h-8 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center"
        >
          <PlusIcon className="w-4 h-4 text-blue-400" />
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        {Array.from({ length: waterTarget }).map((_, idx) => (
          <div
            key={idx}
            className={`flex-1 h-2 rounded-full transition-all duration-300 ${
              idx < waterIntake
                ? 'bg-blue-400 shadow-sm shadow-blue-400/50'
                : 'bg-white/5'
            }`}
            style={{
              animation: idx < waterIntake ? `scaleIn 0.3s ease-out ${idx * 0.05}s both` : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );

  const renderAddMealButton = () => (
    <button
      onClick={() => setShowAddMeal(!showAddMeal)}
      className="bg-zinc-900/50 hover:bg-emerald-950/50 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 flex items-center justify-center min-h-[110px] group"
    >
      <PlusIcon className="w-8 h-8 text-emerald-400/60 group-hover:text-emerald-400 transition-colors" />
    </button>
  );

  // Main Render
  return (
    <div className="bg-black rounded-3xl p-6 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-black text-xl tracking-tight">Diet Plan</h3>
        <button className="text-white/40 hover:text-emerald-400 transition-colors p-2 hover:bg-emerald-500/10 rounded-lg">
          <DotsIcon />
        </button>
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-2 gap-3">
        {meals.map((meal, index) => renderMealCard(meal, index))}
        {renderAddMealButton()}
      </div>
    </div>
  );
}
