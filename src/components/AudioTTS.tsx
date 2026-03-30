import { useState } from 'react';
import { Card } from './ui/Card';
import { Slider } from './ui/Slider';
import { Switch } from './ui/Switch';
import { Volume2, Upload, Mic2, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export default function AudioTTS() {
  const [soundVolume, setSoundVolume] = useState(75);
  const [ttsVolume, setTtsVolume] = useState(100);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [filterEnabled, setFilterEnabled] = useState(true);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Аудио и Озвучка</h1>
        <p className="text-[#8E9299] mt-1">Настройте звуки уведомлений и оффлайн-синтез речи (TTS).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alert Sound */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#222228] flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-[#F14635]" />
            </div>
            <h2 className="text-lg font-semibold">Звук уведомления</h2>
          </div>

          <div className="border-2 border-dashed border-[#222228] hover:border-[#F14635] transition-colors rounded-xl p-6 text-center cursor-pointer bg-[#0A0A0C]/50 mb-6">
            <Upload className="w-5 h-5 text-[#8E9299] mx-auto mb-2" />
            <p className="font-medium text-white text-sm">Загрузить звук (MP3/WAV)</p>
            <p className="text-xs text-[#8E9299] mt-1">Текущий: kaspi_chime.mp3</p>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[#8E9299]">Громкость звука</span>
              <span className="font-mono text-white">{soundVolume}%</span>
            </div>
            <Slider value={soundVolume} onChange={setSoundVolume} />
          </div>
        </Card>

        {/* TTS Settings */}
        <Card className="flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#222228] flex items-center justify-center">
                <Mic2 className="w-5 h-5 text-[#00E65B]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Оффлайн Озвучка (TTS)</h2>
                <p className="text-xs text-[#8E9299]">Работает локально, без интернета</p>
              </div>
            </div>
            <Switch checked={ttsEnabled} onChange={setTtsEnabled} />
          </div>

          <div className={`space-y-5 transition-opacity ${ttsEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#8E9299] mb-2">Язык</label>
                <select className="w-full bg-[#0A0A0C] border border-[#222228] rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#F14635]">
                  <option>Русский (RU)</option>
                  <option>Казахский (KZ)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8E9299] mb-2">Голосовая модель</label>
                <select className="w-full bg-[#0A0A0C] border border-[#222228] rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#F14635]">
                  <option>Silero (Мужской 1)</option>
                  <option>Silero (Женский 1)</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#8E9299]">Громкость озвучки</span>
                <span className="font-mono text-white">{ttsVolume}%</span>
              </div>
              <Slider value={ttsVolume} onChange={setTtsVolume} />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8E9299] mb-2">Шаблон озвучивания</label>
              <input 
                type="text" 
                defaultValue="{name} задонатил {amount} тенге и говорит: {message}"
                className="w-full bg-[#0A0A0C] border border-[#222228] rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#F14635] font-mono text-sm"
              />
              <p className="text-xs text-[#8E9299] mt-2">Переменные: {'{name}'}, {'{amount}'}, {'{message}'}</p>
            </div>

            <div className="pt-4 border-t border-[#222228] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#FFB020]" />
                <span className="text-sm font-medium text-gray-200">Фильтр мата (запикивание)</span>
              </div>
              <Switch checked={filterEnabled} onChange={setFilterEnabled} />
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
