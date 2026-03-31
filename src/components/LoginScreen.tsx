import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DollarSign, Heart, Star, Trophy, Zap, Play, LogIn } from 'lucide-react';

export default function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // Show login form after 3.5 seconds of animation
    const timer = setTimeout(() => {
      setShowLogin(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const floatingIcons = [
    { Icon: DollarSign, color: '#10B981', delay: 0, x: -150, y: -100 },
    { Icon: Heart, color: '#EF4444', delay: 0.3, x: 200, y: 150 },
    { Icon: Star, color: '#F59E0B', delay: 0.6, x: -200, y: 200 },
    { Icon: Trophy, color: '#8B5CF6', delay: 0.9, x: 150, y: -150 },
    { Icon: Zap, color: '#3B82F6', delay: 1.2, x: 0, y: -200 },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center font-sans">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/70 z-10" /> {/* Overlay */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover opacity-60"
          // Replace this URL with the actual uploaded video URL if hosted
          src="https://cdn.pixabay.com/video/2020/05/25/40130-425338667_large.mp4" 
        />
      </div>

      {/* Floating SVGs Animation */}
      <AnimatePresence>
        {!showLogin && (
          <motion.div 
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
            exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            {floatingIcons.map((item, i) => {
              const Icon = item.Icon;
              return (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{ 
                    opacity: [0, 1, 1, 0], 
                    scale: [0.5, 1.5, 1.5, 2],
                    x: item.x,
                    y: item.y,
                    rotate: [0, 90, 180]
                  }}
                  transition={{ 
                    duration: 3.5, 
                    delay: item.delay,
                    ease: "easeInOut"
                  }}
                >
                  <Icon className="w-16 h-16" style={{ color: item.color, filter: `drop-shadow(0 0 20px ${item.color})` }} />
                </motion.div>
              );
            })}
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1, type: "spring" }}
              className="text-center"
            >
              <h1 className="text-7xl font-black text-white tracking-tighter mb-4" style={{ textShadow: '0 0 40px rgba(241,70,53,0.5)' }}>
                Kaspi<span className="text-[#F14635]">Stream</span>
              </h1>
              <p className="text-2xl text-gray-300 font-medium tracking-wide">Новый уровень донатов</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Form */}
      <AnimatePresence>
        {showLogin && (
          <motion.div 
            className="relative z-30 w-full max-w-md p-8 rounded-3xl bg-black/50 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#F14635] to-[#FF7E67] rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(241,70,53,0.4)]">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Вход в систему</h2>
              <p className="text-[#8E9299]">Управляйте своими стримами и донатами</p>
            </div>

            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input 
                  type="email" 
                  placeholder="streamer@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#F14635] focus:ring-1 focus:ring-[#F14635] transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Пароль</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#F14635] focus:ring-1 focus:ring-[#F14635] transition-all"
                  required
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-[#F14635] hover:bg-[#D93E2F] text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(241,70,53,0.3)] hover:shadow-[0_0_30px_rgba(241,70,53,0.5)] mt-4"
              >
                <LogIn className="w-5 h-5" />
                Войти в панель
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-sm text-gray-400">
                Нет аккаунта?{' '}
                <a href="#" className="text-[#F14635] hover:text-white font-medium transition-colors">
                  Зарегистрируйтесь на сайте
                </a>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
