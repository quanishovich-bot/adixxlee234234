import { useState } from 'react';
import { Card } from './ui/Card';
import { Copy, CheckCircle2, XCircle, Play, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const [copied, setCopied] = useState(false);
  const overlayUrl = "http://localhost:3000/overlay/kaspi_12345";

  const handleCopy = () => {
    navigator.clipboard.writeText(overlayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <div className="text-4xl font-mono font-bold text-white">145 500 <span className="text-xl text-[#F14635]">₸</span></div>
          <div className="mt-2 text-sm text-[#00E65B] flex items-center gap-1">
            <span>+12% с прошлого стрима</span>
          </div>
        </Card>
        <Card>
          <div className="text-[#8E9299] text-sm font-medium uppercase tracking-wider mb-2">Топ донатер</div>
          <div className="text-2xl font-bold text-white truncate">Almas B.</div>
          <div className="mt-1 text-lg font-mono text-[#8E9299]">50 000 ₸</div>
        </Card>
        <Card>
          <div className="text-[#8E9299] text-sm font-medium uppercase tracking-wider mb-2">Последний донат</div>
          <div className="text-2xl font-bold text-white truncate">Zhanar</div>
          <div className="mt-1 text-lg font-mono text-[#8E9299]">2 000 ₸</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Status */}
        <Card className="flex flex-col lg:col-span-1">
          <h2 className="text-lg font-semibold mb-6">Статус системы</h2>
          <div className="space-y-6 flex-1">
            <StatusItem label="Перехват уведомлений Windows" status="active" />
            <StatusItem label="Локальный веб-сервер" status="active" />
            <StatusItem label="Подключение к OBS (WebSocket)" status="error" errorMsg="OBS не запущен или WebSocket выключен" />
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
            <button className="flex-1 flex items-center justify-center gap-2 bg-[#F14635] hover:bg-[#D93E2F] text-white py-3 rounded-xl font-semibold transition-all shadow-[0_4px_14px_rgba(241,70,53,0.3)] hover:shadow-[0_6px_20px_rgba(241,70,53,0.4)]">
              <Play className="w-5 h-5 fill-current" />
              Отправить тестовый донат
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
