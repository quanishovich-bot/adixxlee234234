import { useState } from 'react';
import { Card } from './ui/Card';
import { Play, Pause, RotateCcw, SkipForward, Trash2, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSocket } from '../lib/SocketContext';

export default function Queue() {
  const [isPaused, setIsPaused] = useState(false);
  const { donations } = useSocket();

  // In a real app, you'd want to manage local state for removing/skipping items 
  // or send a request to the backend to delete them. For now, we'll just display them.
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());

  const removeDonation = (id: string) => {
    setHiddenIds(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  const visibleDonations = donations.filter(d => !hiddenIds.has(d.id));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">История и Очередь</h1>
          <p className="text-[#8E9299] mt-1">Управление входящими донатами и повтор алертов.</p>
        </div>
        
        {/* Master Control */}
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
            isPaused 
              ? 'bg-[#FFB020] text-black shadow-[0_0_15px_rgba(255,176,32,0.4)]' 
              : 'bg-[#222228] text-white hover:bg-[#2A2A32]'
          }`}
        >
          {isPaused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5 fill-current" />}
          {isPaused ? 'Возобновить показ' : 'Пауза алертов'}
        </button>
      </div>

      <Card className="flex-1 overflow-hidden flex flex-col p-0">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#222228] text-xs font-medium text-[#8E9299] uppercase tracking-wider bg-[#0A0A0C]/50">
          <div className="col-span-2">Время</div>
          <div className="col-span-3">Отправитель и Сумма</div>
          <div className="col-span-4">Сообщение</div>
          <div className="col-span-3 text-right">Действия</div>
        </div>
        
        <div className="overflow-y-auto flex-1 p-2 space-y-2">
          <AnimatePresence>
            {visibleDonations.map((donation) => {
              const date = new Date(donation.timestamp);
              const timeString = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
              
              return (
              <motion.div 
                key={donation.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`grid grid-cols-12 gap-4 p-4 rounded-xl items-center transition-colors bg-[#1A1A20] border border-[#222228]`}
              >
                <div className="col-span-2 text-sm text-[#8E9299] font-mono">{timeString}</div>
                <div className="col-span-3">
                  <div className="font-bold text-white">{donation.sender}</div>
                  <div className="text-[#F14635] font-mono font-medium">{donation.amount.toLocaleString()} ₸</div>
                </div>
                <div className="col-span-4 flex items-start gap-2">
                  {donation.message ? (
                    <>
                      <MessageSquare className="w-4 h-4 text-[#8E9299] mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-300 line-clamp-2">{donation.message}</span>
                    </>
                  ) : (
                    <span className="text-sm text-[#8E9299] italic">Без сообщения</span>
                  )}
                </div>
                <div className="col-span-3 flex items-center justify-end gap-2">
                  <button 
                    className="p-2 rounded-lg bg-[#222228] hover:bg-[#2A2A32] text-white transition-colors tooltip-trigger"
                    title="Повторить на экране"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => removeDonation(donation.id)}
                    className="p-2 rounded-lg bg-[#222228] hover:bg-[#FF4444]/20 text-[#FF4444] transition-colors"
                    title="Скрыть"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )})}
          </AnimatePresence>
          {visibleDonations.length === 0 && (
            <div className="text-center py-12 text-[#8E9299]">
              Нет донатов в истории.
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
