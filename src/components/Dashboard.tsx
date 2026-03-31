import { useState, useMemo } from 'react';
import { Card } from './ui/Card';
import { Copy, CheckCircle2, XCircle, Play, Link as LinkIcon, AlertTriangle, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';
import { useSocket } from '../lib/SocketContext';

export default function Dashboard() {
  const [copied, setCopied] = useState(false);
  const { donations, isConnected, socket } = useSocket();
  const overlayUrl = `${window.location.origin}/widget/latest/kaspi_12345`;

  const handleCopy = () => {
    navigator.clipboard.writeText(overlayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalCollected = useMemo(() => {
    return donations.reduce((sum, d) => sum + d.amount, 0);
  }, [donations]);

  const topDonator = useMemo(() => {
    if (donations.length === 0) return null;
    const totals = donations.reduce((acc, d) => {
      acc[d.sender] = (acc[d.sender] || 0) + d.amount;
      return acc;
    }, {} as Record<string, number>);
    
    let maxSender = '';
    let maxAmount = 0;
    for (const [sender, amount] of Object.entries(totals)) {
      if (amount > maxAmount) {
        maxAmount = amount;
        maxSender = sender;
      }
    }
    return { sender: maxSender, amount: maxAmount };
  }, [donations]);

  const latestDonation = donations[0];

  const sendTestDonation = async () => {
    try {
      await fetch('/api/webhooks/kaspi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.floor(Math.random() * 5000) + 500,
          sender: 'Тестовый Зритель',
          message: 'Это тестовый донат для проверки! https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        })
      });
    } catch (error) {
      console.error('Failed to send test donation', error);
    }
  };

  const skipMedia = () => {
    if (socket) {
      socket.emit('skip_media');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Дашборд</h1>
        <p className="text-[#8E9299] mt-1">Обзор активности донатов и статуса работы системы.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-[#8E9299] text-sm font-medium uppercase tracking-wider mb-2">Собрано сегодня</div>
          <div className="text-4xl font-mono font-bold text-white">{totalCollected.toLocaleString()} <span className="text-xl text-[#F14635]">₸</span></div>
          <div className="mt-2 text-sm text-[#00E65B] flex items-center gap-1">
            <span>В реальном времени</span>
          </div>
        </Card>
        <Card>
          <div className="text-[#8E9299] text-sm font-medium uppercase tracking-wider mb-2">Топ донатер</div>
          <div className="text-2xl font-bold text-white truncate">{topDonator ? topDonator.sender : 'Нет данных'}</div>
          <div className="mt-1 text-lg font-mono text-[#8E9299]">{topDonator ? `${topDonator.amount.toLocaleString()} ₸` : '0 ₸'}</div>
        </Card>
        <Card>
          <div className="text-[#8E9299] text-sm font-medium uppercase tracking-wider mb-2">Последний донат</div>
          <div className="text-2xl font-bold text-white truncate">{latestDonation ? latestDonation.sender : 'Нет данных'}</div>
          <div className="mt-1 text-lg font-mono text-[#8E9299]">{latestDonation ? `${latestDonation.amount.toLocaleString()} ₸` : '0 ₸'}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Status */}
        <Card className="flex flex-col lg:col-span-1">
          <h2 className="text-lg font-semibold mb-6">Статус системы</h2>
          <div className="space-y-6 flex-1">
            <StatusItem label="Подключение к серверу" status={isConnected ? "active" : "error"} errorMsg={!isConnected ? "Соединение потеряно" : undefined} />
            <StatusItem label="Связь с телефоном (Kaspi)" status="active" />
          </div>
        </Card>

        {/* Quick Actions & Overlay */}
        <Card className="flex flex-col lg:col-span-2">
          <h2 className="text-lg font-semibold mb-6">Настройка основного оверлея</h2>
          
          <div className="space-y-2 mb-8">
            <label className="text-sm text-[#8E9299] font-medium">Ссылка для Browser Source (Алерты)</label>
            <div className="flex items-center gap-2 bg-[#0A0A0C] border border-[#222228] rounded-xl p-1 pl-4">
              <LinkIcon className="w-4 h-4 text-[#8E9299]" />
              <input 
                type="text" 
                readOnly 
                value={overlayUrl} 
                className="bg-transparent border-none outline-none flex-1 text-sm font-mono text-gray-300"
              />
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 bg-[#222228] hover:bg-[#2A2A32] text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-[#00E65B]" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Скопировано' : 'Копировать'}
              </button>
            </div>
            <p className="text-xs text-[#8E9299] mt-2">Добавьте эту ссылку как "Браузер" (Browser Source) в OBS. Рекомендуемый размер: 800x600.</p>
          </div>

          <div className="mt-auto pt-6 border-t border-[#222228] flex gap-4">
            <button onClick={sendTestDonation} className="flex-1 flex items-center justify-center gap-2 bg-[#F14635] hover:bg-[#D93E2F] text-white py-3 rounded-xl font-semibold transition-all shadow-[0_4px_14px_rgba(241,70,53,0.3)] hover:shadow-[0_6px_20px_rgba(241,70,53,0.4)]">
              <Play className="w-5 h-5 fill-current" />
              Отправить тестовый донат
            </button>
            <button onClick={skipMedia} className="flex-1 flex items-center justify-center gap-2 bg-[#222228] hover:bg-[#2A2A32] text-white py-3 rounded-xl font-semibold transition-all border border-[#33333C]">
              <XCircle className="w-5 h-5" />
              Пропустить медиа
            </button>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

function StatusItem({ label, status, errorMsg }: { label: string, status: 'active' | 'error', errorMsg?: string }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="font-medium text-gray-200">{label}</div>
        {errorMsg && <div className="text-xs text-[#FF4444] mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {errorMsg}</div>}
      </div>
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
        status === 'active' 
          ? 'bg-[#00E65B]/10 text-[#00E65B] border-[#00E65B]/20' 
          : 'bg-[#FF4444]/10 text-[#FF4444] border-[#FF4444]/20'
      }`}>
        <div className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-[#00E65B] shadow-[0_0_5px_#00E65B]' : 'bg-[#FF4444] shadow-[0_0_5px_#FF4444]'}`}></div>
        {status === 'active' ? 'Работает' : 'Ошибка'}
      </div>
    </div>
  );
}
