import React from 'react';
import { motion } from 'motion/react';
import { User, Shield, Zap, CheckCircle2, LogOut, Volume2, Palette } from 'lucide-react';

export default function Profile({ onLogout }: { onLogout: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6 pb-12"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Профиль</h1>
          <p className="text-[#8E9299] mt-1">Управление аккаунтом и подпиской</p>
        </div>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-gray-300 hover:bg-red-500/10 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Выйти
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info */}
        <div className="lg:col-span-1 bg-[#141418] border border-[#222228] rounded-2xl p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-1 mb-4">
              <div className="w-full h-full bg-[#141418] rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-gray-400" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">Almas B.</h2>
            <p className="text-[#8E9299] text-sm mb-4">streamer@example.com</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F14635]/10 text-[#F14635] text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              Pro Подписка
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-[#222228]">
              <span className="text-[#8E9299] text-sm">ID Аккаунта</span>
              <span className="text-white font-mono text-sm">#847291</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-[#222228]">
              <span className="text-[#8E9299] text-sm">Регистрация</span>
              <span className="text-white text-sm">12 Окт 2023</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-[#8E9299] text-sm">Всего донатов</span>
              <span className="text-white font-bold text-sm">1,245,000 ₸</span>
            </div>
          </div>
        </div>

        {/* Subscription Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-[#1A1A20] to-[#141418] border border-[#222228] rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F14635] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="flex items-start justify-between relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">PRO Тариф</h2>
                  <span className="px-2.5 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Активен
                  </span>
                </div>
                <p className="text-[#8E9299] max-w-md">Ваша подписка активна. Следующее списание 15 Ноября 2026 года.</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-white">4 990 ₸</div>
                <div className="text-[#8E9299] text-sm">в месяц</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 relative z-10">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="w-10 h-10 rounded-lg bg-[#F14635]/20 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-[#F14635]" />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">Медиа-заказы</div>
                  <div className="text-[#8E9299] text-xs">YouTube видео в донатах</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                  <Volume2 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">TTS Озвучка</div>
                  <div className="text-[#8E9299] text-xs">Премиум голоса для донатов</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                  <Palette className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">Кастомные стили</div>
                  <div className="text-[#8E9299] text-xs">Все стили виджетов разблокированы</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">Приоритетная поддержка</div>
                  <div className="text-[#8E9299] text-xs">Ответ в течение 15 минут</div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#222228] flex gap-3 relative z-10">
              <button className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium transition-colors text-sm">
                Управление подпиской
              </button>
              <button className="px-5 py-2.5 rounded-xl bg-transparent hover:bg-white/5 text-[#8E9299] hover:text-white font-medium transition-colors text-sm">
                История платежей
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
