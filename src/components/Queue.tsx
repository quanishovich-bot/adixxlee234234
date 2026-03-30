import { useState } from 'react';
import { Card } from './ui/Card';
import { Play, Pause, RotateCcw, SkipForward, Trash2, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MOCK_DONATIONS = [
  { id: 1, name: 'DarkSlayer99', amount: 5000, message: 'Отличный стрим, продолжай в том же духе!', time: '22:42', status: 'played' },
  { id: 2, name: 'Anna K.', amount: 1000, message: 'Привет из Алматы!', time: '22:45', status: 'played' },
  { id: 3, name: 'Аноним', amount: 500, message: '', time: '22:48', status: 'queued' },
  { id: 4, name: 'GamerBoy', amount: 15000, message: 'На новую видеокарту бро', time: '22:50', status: 'queued' },
];

export default function Queue() {
  const [isPaused, setIsPaused] = useState(false);
  const [donations, setDonations] = useState(MOCK_DONATIONS);

  const removeDonation = (id: number) => {
    setDonations(donations.filter(d => d.id !== id));
  };

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
            {donations.map((donation) => (
              <motion.div 
                key={donation.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`grid grid-cols-12 gap-4 p-4 rounded-xl items-center transition-colors ${
                  donation.status === 'queued' ? 'bg-[#1A1A20] border border-[#222228]' : 'bg-transparent hover:bg-[#1A1A20]/50'
                }`}
              >
                <div className="col-span-2 text-sm text-[#8E9299] font-mono">{donation.time}</div>
                <div className="col-span-3">
                  <div className="font-bold text-white">{donation.name}</div>
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
                  {donation.status === 'queued' && (
                    <button 
                      onClick={() => removeDonation(donation.id)}
                      className="p-2 rounded-lg bg-[#222228] hover:bg-[#FFB020]/20 text-[#FFB020] transition-colors"
                      title="Пропустить алерт"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => removeDonation(donation.id)}
                    className="p-2 rounded-lg bg-[#222228] hover:bg-[#FF4444]/20 text-[#FF4444] transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {donations.length === 0 && (
            <div className="text-center py-12 text-[#8E9299]">
              Нет донатов в очереди.
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
