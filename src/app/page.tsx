'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowRight, ChevronLeft, ChevronRight, Search, Facebook, Instagram, Linkedin, Menu, X, User, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (profileMenuOpen && !target.closest('.profile-menu-container')) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileMenuOpen]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
        <div className="bg-black/60 backdrop-blur-xl border border-gray-800/50 rounded-full shadow-2xl">
          <div className="flex items-center justify-between h-14 md:h-16 px-4 md:px-8">
            <div className="text-lg md:text-xl font-bold text-white">CricProdigy</div>
            
            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1">
              <Link href="/" className="text-white hover:text-emerald-400 transition-colors px-4 py-2 rounded-full hover:bg-white/5">
                Home
              </Link>
              <Link href="/assessment" className="text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-white/5">
                Assessment
              </Link>
              <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-white/5">
                Pricing
              </Link>
              <Link href="/faq" className="text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-white/5">
                FAQ
              </Link>
              <Link href="/library" className="text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-white/5">
                Library
              </Link>
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-white/5">
                About Us
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {status === 'authenticated' && session?.user ? (
                <div className="profile-menu-container relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 transition-all"
                  >
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-black font-bold">
                        {session.user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <span className="text-white text-sm font-medium">{session.user.name}</span>
                  </button>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {profileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50"
                      >
                        <div className="p-4 border-b border-white/10">
                          <div className="flex items-center gap-3">
                            {session.user.image ? (
                              <Image
                                src={session.user.image}
                                alt={session.user.name || 'User'}
                                width={48}
                                height={48}
                                className="rounded-full"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-black font-bold text-xl">
                                {session.user.name?.charAt(0).toUpperCase() || 'U'}
                              </div>
                            )}
                            <div>
                              <p className="text-white font-semibold">{session.user.name}</p>
                              <p className="text-gray-400 text-sm">{session.user.email}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-2">
                          <Link href="/player-hub">
                            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-white hover:bg-white/10 rounded-xl transition-colors text-left">
                              <User className="h-4 w-4" />
                              <span>Player Hub</span>
                            </button>
                          </Link>
                          <Link href="/settings">
                            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-white hover:bg-white/10 rounded-xl transition-colors text-left">
                              <Settings className="h-4 w-4" />
                              <span>Settings</span>
                            </button>
                          </Link>
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-left"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/auth/signup" className="hidden md:block">
                  <Button className="bg-white text-black hover:bg-gray-100 transition-all rounded-full px-4 md:px-6 py-2 font-medium text-sm md:text-base">
                    Sign up
                  </Button>
                </Link>
              )}
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-white hover:text-emerald-400 transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden mt-2 bg-black/90 backdrop-blur-xl border border-gray-800/50 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col p-4">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-emerald-400 transition-colors px-4 py-3 rounded-xl hover:bg-white/5">
                Home
              </Link>
              <Link href="/assessment" onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white transition-colors px-4 py-3 rounded-xl hover:bg-white/5">
                Assessment
              </Link>
              <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white transition-colors px-4 py-3 rounded-xl hover:bg-white/5">
                Pricing
              </Link>
              <Link href="/faq" onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white transition-colors px-4 py-3 rounded-xl hover:bg-white/5">
                FAQ
              </Link>
              <Link href="/library" onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white transition-colors px-4 py-3 rounded-xl hover:bg-white/5">
                Library
              </Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white transition-colors px-4 py-3 rounded-xl hover:bg-white/5">
                About Us
              </Link>
              
              {status === 'authenticated' && session?.user ? (
                <>
                  <div className="px-4 py-3 border-t border-white/10 mt-2">
                    <div className="flex items-center gap-3 mb-3">
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || 'User'}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-black font-bold">
                          {session.user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                      <div>
                        <p className="text-white font-semibold text-sm">{session.user.name}</p>
                        <p className="text-gray-400 text-xs">{session.user.email}</p>
                      </div>
                    </div>
                  </div>
                  <Link href="/player-hub" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-emerald-400 transition-colors px-4 py-3 rounded-xl hover:bg-white/5 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Player Hub
                  </Link>
                  <Link href="/settings" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-emerald-400 transition-colors px-4 py-3 rounded-xl hover:bg-white/5 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="w-full text-red-400 hover:text-red-300 transition-colors px-4 py-3 rounded-xl hover:bg-red-500/10 flex items-center gap-2 text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)} className="mt-2">
                  <Button className="w-full bg-emerald-500 text-black hover:bg-emerald-400 transition-all rounded-xl py-3 font-medium">
                    Sign up
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </nav>
      <br /><br />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-black via-black to-gray-900 pt-20 md:pt-0">
        {/* Mobile Background Image */}
        <div className="lg:hidden absolute inset-0 z-0">
          <Image
            src="/hero.png"
            alt="Athlete running"
            fill
            className="object-cover opacity-200"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black"></div>
        </div>

        {/* Background gradient glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-transparent via-emerald-500/5 to-transparent z-10"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div 
              className="space-y-6 md:space-y-8 text-center lg:text-left order-2 lg:order-1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="font-bold leading-none">
                <motion.div 
                  className="text-[clamp(3.5rem,12vw,6rem)] md:text-7xl lg:text-8xl text-white mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Next.
                </motion.div>
                <motion.div 
                  className="text-[clamp(3.5rem,12vw,6rem)] md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300 drop-shadow-[0_0_40px_rgba(16,185,129,0.5)] mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Generation.
                </motion.div>
                <motion.div 
                  className="text-[clamp(3.5rem,12vw,6rem)] md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300 drop-shadow-[0_0_40px_rgba(16,185,129,0.5)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  Cricket.
                </motion.div>
              </h1>
              <motion.p 
                className="text-gray-400 text-[clamp(1rem,3.5vw,1.25rem)] md:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                At CricProdigy, we're not just a cricket and nutrition platform we're your dedicated partners on your journey to a healthier, happier you.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 rounded-full px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base font-semibold group">
                  Meet Our Team
                  <ArrowDown className="ml-2 h-4 md:h-5 w-4 md:w-5 group-hover:translate-y-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
            <motion.div 
              className="hidden lg:block relative h-[600px] order-1 lg:order-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Glow effect behind image */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 blur-3xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              ></motion.div>
              {/* Hero Image */}
              <div className="relative h-full w-230">
                <Image
                  src="/hero.png"
                  alt="Athlete running"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI/ML Metrics Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-black py-16 md:py-0">
        {/* Background gradient glow */}
        <div className="absolute inset-0 bg-gradient-to-l from-black via-transparent to-transparent z-10"></div>
        <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent z-10"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div 
              className="relative h-[400px] md:h-[500px] lg:h-[600px]"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 blur-3xl"></div>
              
              {/* Image with overlay metrics */}
              <div className="relative h-full rounded-3xl overflow-hidden">
                {/* Main Image with blur on edges */}
                <div className="relative w-full h-full">
                  <Image
                    src="/metrics.png"
                    alt="Athlete with fitness metrics"
                    fill
                    className="object-contain"
                  />
                  {/* Gradient overlay to fade edges */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
                </div>
                
                {/* Overlay metrics */}
                <div className="absolute top-4 md:top-10 left-4 md:left-10 bg-black/40 backdrop-blur-sm rounded-xl md:rounded-2xl p-2 md:p-4 border border-white/10">
                  <div className="text-3xl md:text-5xl font-bold text-white mb-1 tracking-tight">121</div>
                  <div className="text-emerald-400 text-xs md:text-sm font-semibold flex items-center gap-2">
                    <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    bpm
                  </div>
                </div>
                
                <div className="absolute top-4 md:top-10 right-4 md:right-10 bg-black/40 backdrop-blur-sm rounded-xl md:rounded-2xl p-2 md:p-4 border border-white/10">
                  <div className="text-3xl md:text-5xl font-bold text-white mb-1 tracking-tight">98.3</div>
                  <div className="text-red-400 text-xs md:text-sm font-semibold flex items-center gap-2">
                    <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-red-400 rounded-full animate-pulse"></div>
                    SpO2
                  </div>
                </div>
                
                <div className="absolute top-1/3 right-4 md:right-10">
                  <Button className="bg-white/10 backdrop-blur-xl text-white text-[10px] md:text-xs font-medium border border-white/20 hover:bg-white/20 hover:border-emerald-500/50 transition-all rounded-full px-3 md:px-6 py-1.5 md:py-2 uppercase tracking-wider">
                    Our Vision
                  </Button>
                </div>
                
                <div className="absolute bottom-4 md:bottom-10 left-4 md:left-10">
                  <Button className="bg-emerald-500 text-black hover:bg-emerald-400 transition-all rounded-full px-4 md:px-8 py-2 md:py-3 font-bold text-xs md:text-sm shadow-lg shadow-emerald-500/50">
                    <span className="mr-1 md:mr-2 text-sm md:text-base">💡</span>
                    52 Cricket Tips
                  </Button>
                </div>
                
                {/* Connection points with better visibility */}
                <div className="absolute top-[30%] right-[35%] w-2 md:w-3 h-2 md:h-3 bg-white rounded-full shadow-lg shadow-white/80 ring-1 md:ring-2 ring-white/30"></div>
                <div className="absolute top-[45%] right-[30%] w-2 md:w-3 h-2 md:h-3 bg-white rounded-full shadow-lg shadow-white/80 ring-1 md:ring-2 ring-white/30"></div>
                <div className="absolute top-[55%] right-[38%] w-2 md:w-3 h-2 md:h-3 bg-white rounded-full shadow-lg shadow-white/80 ring-1 md:ring-2 ring-white/30"></div>
                <div className="absolute bottom-[35%] right-[32%] w-2 md:w-3 h-2 md:h-3 bg-white rounded-full shadow-lg shadow-white/80 ring-1 md:ring-2 ring-white/30"></div>
              </div>
            </motion.div>
            
            <motion.div 
              className="space-y-6 md:space-y-8 text-center lg:text-left mt-8 lg:mt-0"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-bold leading-tight">
                <motion.div 
                  className="text-3xl md:text-5xl lg:text-6xl text-white mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  We are on a mission to empower individuals worldwide to lead
                </motion.div>
                <motion.div 
                  className="text-3xl md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300 drop-shadow-[0_0_40px_rgba(16,185,129,0.5)]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  healthier lives
                </motion.div>
              </h2>
              
              <motion.p 
                className="text-gray-400 text-base md:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                By blending Cricket with precision{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300 font-bold text-lg md:text-xl">
                  AI ML
                </span>{' '}
                we aim to make cricket and nutrition personalized
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap justify-center lg:justify-start gap-3 md:gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Button className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:border-emerald-500/50 transition-all rounded-full px-4 md:px-6 py-2 md:py-2.5 font-medium text-[10px] md:text-xs tracking-wider uppercase">
                  Bowling Analysis
                </Button>
                <Button className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:border-emerald-500/50 transition-all rounded-full px-4 md:px-6 py-2 md:py-2.5 font-medium text-[10px] md:text-xs tracking-wider uppercase">
                  Performance Score
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-black py-16 md:py-32">
        {/* Background gradient glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-emerald-500/5 to-black z-10"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-20">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-12 md:mb-24">
            <span className="text-white">Our Core </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300 drop-shadow-[0_0_40px_rgba(16,185,129,0.5)]">
              Values
            </span>
          </h2>
          
          <div className="space-y-6 md:space-y-8 max-w-6xl mx-auto">
            {/* Value 1 - Fielding */}
            <motion.div 
              className="group relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="p-6 md:p-12 space-y-4 md:space-y-6 flex flex-col justify-center order-2 md:order-1">
                  <div className="text-emerald-400 font-bold text-xs md:text-sm tracking-widest uppercase">01</div>
                  <h3 className="text-2xl md:text-4xl font-bold">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300">
                      Fielding
                    </span>
                    <span className="text-white"> Excellence</span>
                  </h3>
                  <p className="text-gray-400 text-sm md:text-lg leading-relaxed">
                    Master the art of fielding with precision training, agility drills, and game-changing techniques to dominate the field.
                  </p>
                </div>
                <div className="relative h-[250px] md:h-full md:min-h-[400px] order-1 md:order-2">
                  {/* Glow behind image */}
                  <div className="absolute inset-0 bg-gradient-to-l from-emerald-500/20 to-transparent blur-2xl"></div>
                  <div className="relative h-full">
                    <Image
                      src="/fielding.png"
                      alt="Fielding excellence"
                      fill
                      className="object-cover"
                    />
                    {/* Gradient fade */}
                    <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-transparent to-black/60"></div>
                  </div>
                </div>
                <button className="absolute top-4 md:top-8 right-4 md:right-8 w-10 md:w-14 h-10 md:h-14 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center hover:bg-emerald-500 hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 border border-white/20">
                  <ArrowRight className="h-4 md:h-6 w-4 md:w-6 text-white" />
                </button>
              </div>
            </motion.div>

            {/* Value 2 - Keeping */}
            <motion.div 
              className="group relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="p-6 md:p-12 space-y-4 md:space-y-6 flex flex-col justify-center order-2 md:order-1">
                  <div className="text-emerald-400 font-bold text-xs md:text-sm tracking-widest uppercase">02</div>
                  <h3 className="text-2xl md:text-4xl font-bold">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300">
                      Wicket Keeping
                    </span>
                    <span className="text-white"> Mastery</span>
                  </h3>
                  <p className="text-gray-400 text-sm md:text-lg leading-relaxed">
                    Perfect your wicket keeping skills with expert training in catches, stumpings, and lightning-fast reflexes behind the stumps.
                  </p>
                </div>
                <div className="relative h-[250px] md:h-full md:min-h-[400px] order-1 md:order-2">
                  {/* Glow behind image */}
                  <div className="absolute inset-0 bg-gradient-to-l from-emerald-500/20 to-transparent blur-2xl"></div>
                  <div className="relative h-full">
                    <Image
                      src="/keeping.png"
                      alt="Wicket keeping mastery"
                      fill
                      className="object-cover"
                    />
                    {/* Gradient fade */}
                    <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-transparent to-black/60"></div>
                  </div>
                </div>
                <button className="absolute top-4 md:top-8 right-4 md:right-8 w-10 md:w-14 h-10 md:h-14 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center hover:bg-emerald-500 hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 border border-white/20">
                  <ArrowRight className="h-4 md:h-6 w-4 md:w-6 text-white" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-black py-16 md:py-32">
        {/* Background gradient glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-emerald-500/5 to-black z-10"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-20">
          <motion.h2 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-12 md:mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-white">Our </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300 drop-shadow-[0_0_40px_rgba(16,185,129,0.5)]">
              Story
            </span>
          </motion.h2>
          
          <div className="relative">
            {/* Timeline years */}
            <div className="flex items-start gap-4 md:gap-12 lg:gap-20 mb-8 md:mb-16 overflow-x-auto">
              <motion.div 
                className="flex-1 min-w-[120px]"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-5xl md:text-8xl lg:text-[140px] font-bold leading-none mb-4">
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600">2023</span>
                </div>
              </motion.div>
              <motion.div 
                className="flex-1 min-w-[120px]"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="text-5xl md:text-8xl lg:text-[140px] font-bold text-gray-800 leading-none mb-4">2024</div>
              </motion.div>
              <motion.div 
                className="flex-1 min-w-[120px]"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="text-5xl md:text-8xl lg:text-[140px] font-bold text-gray-800 leading-none mb-4 opacity-50">2025</div>
              </motion.div>
            </div>
            
            {/* Progress line */}
            <div className="h-0.5 md:h-1 bg-gradient-to-r from-emerald-500 via-gray-700 to-transparent mb-8 md:mb-16 rounded-full"></div>
            
            {/* Content */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 md:gap-0">
              <motion.div 
                className="max-w-xl"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">The New Era</h3>
                <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                  In 2023, CricProdigy emerged with a revolutionary vision—to transform cricket training through cutting-edge AI and ML technology. We're building the future of cricket excellence, one player at a time.
                </p>
              </motion.div>
              
              <div className="flex gap-3 md:gap-4">
                <button className="w-10 md:w-14 h-10 md:h-14 rounded-full border-2 border-gray-700 flex items-center justify-center hover:border-emerald-500 hover:bg-emerald-500/10 transition-all duration-300">
                  <ChevronLeft className="h-4 md:h-6 w-4 md:w-6 text-gray-400 hover:text-white transition-colors" />
                </button>
                <button className="w-10 md:w-14 h-10 md:h-14 rounded-full border-2 border-gray-700 flex items-center justify-center hover:border-emerald-500 hover:bg-emerald-500/10 transition-all duration-300">
                  <ChevronRight className="h-4 md:h-6 w-4 md:w-6 text-gray-400 hover:text-white transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-black py-16 md:py-32">
        {/* Background gradient glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-emerald-500/5 to-black z-10"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0 mb-12 md:mb-24">
            <motion.h2 
              className="text-4xl md:text-6xl lg:text-7xl font-bold"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-white">Meet Our </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300 drop-shadow-[0_0_40px_rgba(16,185,129,0.5)]">
                Team
              </span>
            </motion.h2>
            <div className="relative w-full md:w-auto">
              <input 
                type="text" 
                placeholder="Search Member"
                className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-full px-4 md:px-6 py-2.5 md:py-3 pr-10 md:pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 w-full md:w-80 transition-all text-sm md:text-base"
              />
              <Search className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 h-4 md:h-5 w-4 md:w-5 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { name: 'Azunyan U. Wu', role: 'CEO, Co-Founder' },
              { name: 'Bocchi D. Rock', role: 'Chief Scientific Officer' },
              { name: 'Jared M. Leto', role: 'Senior Product Designer' },
            ].map((member, idx) => (
              <motion.div 
                key={idx} 
                className="group relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                whileHover={{ y: -10 }}
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                  
                  <div className="relative h-full">
                    <Image
                      src={`/team${idx + 1}.png`}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                  <p className="text-gray-400 text-base">{member.role}</p>
                </div>
                
                <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-emerald-500 hover:scale-110 transition-all">
                    <Facebook className="h-4 w-4 text-white" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-emerald-500 hover:scale-110 transition-all">
                    <Instagram className="h-4 w-4 text-white" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-emerald-500 hover:scale-110 transition-all">
                    <Linkedin className="h-4 w-4 text-white" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button className="bg-white text-black hover:bg-gray-100 transition-all rounded-full px-8 md:px-12 py-3 md:py-4 text-sm md:text-base font-bold group">
              Load More Members
              <span className="ml-2 md:ml-3 text-lg md:text-xl group-hover:translate-x-1 transition-transform inline-block">+</span>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-black border-t border-white/10 pt-12 md:pt-20 pb-6 md:pb-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">CricProdigy</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Transforming cricket training through cutting-edge AI and ML technology.
              </p>
              <div className="flex gap-3">
                <motion.a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-emerald-500 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Facebook className="h-4 w-4 text-white" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-emerald-500 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Instagram className="h-4 w-4 text-white" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-emerald-500 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Linkedin className="h-4 w-4 text-white" />
                </motion.a>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="text-white font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-3">
                {['Home', 'Courses', 'Assessment', 'Pricing'].map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Training */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="text-white font-bold text-lg mb-4">Training</h4>
              <ul className="space-y-3">
                {['Batting', 'Bowling', 'Fielding', 'Wicket Keeping'].map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="text-white font-bold text-lg mb-4">Contact</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>contact@cricprodigy.com</li>
                <li>+91 98765 43210</li>
                <li>Mumbai, India</li>
              </ul>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <motion.div 
            className="pt-6 md:pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="text-gray-500 text-xs md:text-sm text-center md:text-left">
              © 2025 CricProdigy. All rights reserved.
            </p>
            <div className="flex gap-4 md:gap-6">
              <Link href="#" className="text-gray-500 hover:text-emerald-400 transition-colors text-xs md:text-sm">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-500 hover:text-emerald-400 transition-colors text-xs md:text-sm">
                Terms of Service
              </Link>
            </div>
          </motion.div>
        </div>
      </footer>

    </div>
  );
}
