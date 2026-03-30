import { useState } from 'react';
import { Card } from './ui/Card';
import { Switch } from './ui/Switch';
import { Settings as SettingsIcon, Filter, Moon, Sun, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';

export default function Settings() {
  const [ignoreEmpty, setIgnoreEmpty] = useState(true);
  const [ignoreSystem, setIgnoreSystem] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Общие настройки</h1>
        <p className="text-[#8E9299] mt-1">Базовые параметры приложения, пороги сумм и фильтры.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Thresholds */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#222228] flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#F14635]" />
            </div>
            <h2 className="text-lg font-semibold">Пороги сумм (Минимум)</h2>
          </div>

          <div className="space-y-5">
            <ThresholdInput 
              label="Показ на экране" 
              desc="Минимальная сумма для появления алерта на стриме" 
              defaultValue={100} 
            />
            <ThresholdInput 
              label="Озвучка сообщения (TTS)" 
              desc="Минимальная сумма для синтеза речи диктором" 
              defaultValue={500} 
            />
            <ThresholdInput 
              label="Медиа и Музыка" 
              desc="Минимальная сумма для показа заказанных видео/GIF" 
              defaultValue={1000} 
            />
          </div>
        </Card>

        {/* Filters & Preferences */}
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#222228] flex items-center justify-center">
                <Filter className="w-5 h-5 text-[#F14635]" />
              </div>
              <h2 className="text-lg font-semibold">Фильтры донатов</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-200">Игнорировать пустые сообщения</div>
                  <div className="text-xs text-[#8E9299] mt-0.5">Не выводить алерт, если зритель не написал текст</div>
                </div>
                <Switch checked={ignoreEmpty} onChange={setIgnoreEmpty} />
              </div>

              <div className="pt-4 border-t border-[#222228] flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-200">Игнорировать системные уведомления</div>
                  <div className="text-xs text-[#8E9299] mt-0.5">Отсеивать рекламу, кэшбеки и пуши от самого Kaspi</div>
                </div>
                <Switch checked={ignoreSystem} onChange={setIgnoreSystem} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#222228] flex items-center justify-center">
                <SettingsIcon className="w-5 h-5 text-[#F14635]" />
              </div>
              <h2 className="text-lg font-semibold">Параметры приложения</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {darkMode ? <Moon className="w-5 h-5 text-[#8E9299]" /> : <Sun className="w-5 h-5 text-[#FFB020]" />}
                  <div>
                    <div className="text-sm font-medium text-gray-200">Темная тема</div>
                    <div className="text-xs text-[#8E9299] mt-0.5">Рекомендуется для комфортной работы ночью</div>
                  </div>
                </div>
                <Switch checked={darkMode} onChange={setDarkMode} />
              </div>
              
              <div className="pt-4 border-t border-[#222228]">
                <label className="block text-sm font-medium text-[#8E9299] mb-2">Язык интерфейса</label>
                <select className="w-full bg-[#0A0A0C] border border-[#222228] rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#F14635]">
                  <option>Русский</option>
                  <option>English</option>
                  <option>Қазақша</option>
                </select>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

function ThresholdInput({ label, desc, defaultValue }: { label: string, desc: string, defaultValue: number }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-200 mb-1">{label}</label>
      <p className="text-xs text-[#8E9299] mb-2">{desc}</p>
      <div className="relative">
        <input 
          type="number" 
          defaultValue={defaultValue}
          className="w-full bg-[#0A0A0C] border border-[#222228] rounded-lg pl-4 pr-12 py-2.5 text-white outline-none focus:border-[#F14635] font-mono transition-colors"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8E9299] font-mono">₸</span>
      </div>
    </div>
  );
}
