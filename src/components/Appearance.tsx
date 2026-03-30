import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Slider } from './ui/Slider';
import { Upload, Image as ImageIcon, AlignCenter, AlignRight, Plus, Trash2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Variation = {
  id: string;
  name: string;
  minAmount: number;
  layout: 'bottom' | 'top' | 'side';
  color: string;
  sound: string;
};

export default function Appearance() {
  const [variations, setVariations] = useState<Variation[]>([
    { id: 'default', name: 'По умолчанию', minAmount: 0, layout: 'bottom', color: '#F14635', sound: 'kaspi_chime.mp3' },
    { id: 'medium', name: 'Средний донат', minAmount: 1000, layout: 'side', color: '#00E65B', sound: 'party_horn.mp3' },
    { id: 'large', name: 'Мега донат!', minAmount: 5000, layout: 'top', color: '#FFB020', sound: 'epic_choir.mp3' },
  ]);
  const [activeVarId, setActiveVarId] = useState('default');
  const [duration, setDuration] = useState(8);

  const activeVar = variations.find(v => v.id === activeVarId) || variations[0];

  const updateActiveVar = (updates: Partial<Variation>) => {
    setVariations(variations.map(v => v.id === activeVarId ? { ...v, ...updates } : v));
  };

  const addVariation = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setVariations([...variations, { 
      id: newId, 
      name: 'Новая вариация', 
      minAmount: 500, 
      layout: 'bottom', 
      color: '#F14635',
      sound: 'kaspi_chime.mp3'
    }]);
    setActiveVarId(newId);
  };

  const deleteVariation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (id === 'default') return;
    const newVars = variations.filter(v => v.id !== id);
    setVariations(newVars);
    if (activeVarId === id) setActiveVarId('default');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Внешний вид и Вариации</h1>
        <p className="text-[#8E9299] mt-1">Настройте разные стили, звуки и картинки в зависимости от суммы доната.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left Column: Variations List */}
        <div className="xl:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold mb-2">Вариации алертов</h2>
          <div className="space-y-2">
            <AnimatePresence>
              {variations.map((v) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={v.id}
                  onClick={() => setActiveVarId(v.id)}
                  className={`p-3 rounded-xl cursor-pointer border transition-all flex items-center justify-between group ${
                    activeVarId === v.id 
                      ? 'bg-[#F14635]/10 border-[#F14635]' 
                      : 'bg-[#141418] border-[#222228] hover:border-gray-600'
                  }`}
                >
                  <div>
                    <div className={`font-medium text-sm ${activeVarId === v.id ? 'text-[#F14635]' : 'text-white'}`}>
                      {v.name}
                    </div>
                    <div className="text-xs text-[#8E9299] mt-0.5">
                      {v.id === 'default' ? 'Любая сумма' : `От ${v.minAmount.toLocaleString()} ₸`}
                    </div>
                  </div>
                  {v.id !== 'default' && (
                    <button 
                      onClick={(e) => deleteVariation(v.id, e)}
                      className="p-1.5 text-[#8E9299] hover:text-[#FF4444] hover:bg-[#FF4444]/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <button 
              onClick={addVariation}
              className="w-full py-3 rounded-xl border border-dashed border-[#222228] hover:border-[#F14635] text-[#8E9299] hover:text-[#F14635] flex items-center justify-center gap-2 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Добавить условие
            </button>
          </div>
        </div>

        {/* Middle Column: Settings for Active Variation */}
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Настройки: {activeVar.name}</h2>
              {activeVar.id !== 'default' && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#8E9299]">Сумма от:</span>
                  <input 
                    type="number" 
                    value={activeVar.minAmount}
                    onChange={(e) => updateActiveVar({ minAmount: Number(e.target.value) })}
                    className="w-24 bg-[#0A0A0C] border border-[#222228] rounded-lg px-3 py-1.5 text-white outline-none focus:border-[#F14635] font-mono text-sm"
                  />
                  <span className="text-sm text-[#8E9299]">₸</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Image Upload */}
              <div className="border-2 border-dashed border-[#222228] hover:border-[#F14635] transition-colors rounded-xl p-6 text-center cursor-pointer bg-[#0A0A0C]/50">
                <Upload className="w-5 h-5 text-[#8E9299] mx-auto mb-2" />
                <p className="font-medium text-white text-sm">Картинка / GIF</p>
                <p className="text-xs text-[#8E9299] mt-1">Макс 10MB</p>
              </div>
              {/* Sound Upload */}
              <div className="border-2 border-dashed border-[#222228] hover:border-[#F14635] transition-colors rounded-xl p-6 text-center cursor-pointer bg-[#0A0A0C]/50">
                <Music className="w-5 h-5 text-[#8E9299] mx-auto mb-2" />
                <p className="font-medium text-white text-sm">Звук алерта</p>
                <p className="text-xs text-[#F14635] mt-1 truncate">{activeVar.sound}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium text-[#8E9299] mb-3 uppercase tracking-wider">Расположение текста</h3>
              <div className="grid grid-cols-3 gap-3">
                <LayoutOption 
                  icon={<AlignCenter className="w-6 h-6" />} 
                  label="Снизу" 
                  active={activeVar.layout === 'bottom'} 
                  onClick={() => updateActiveVar({ layout: 'bottom' })} 
                />
                <LayoutOption 
                  icon={<AlignCenter className="w-6 h-6 rotate-180" />} 
                  label="Сверху" 
                  active={activeVar.layout === 'top'} 
                  onClick={() => updateActiveVar({ layout: 'top' })} 
                />
                <LayoutOption 
                  icon={<AlignRight className="w-6 h-6" />} 
                  label="Сбоку" 
                  active={activeVar.layout === 'side'} 
                  onClick={() => updateActiveVar({ layout: 'side' })} 
                />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <ColorPicker 
                label="Цвет суммы (Акцент)" 
                value={activeVar.color} 
                onChange={(color) => updateActiveVar({ color })} 
              />
            </div>
          </Card>
        </div>

        {/* Right Column: Preview & Timing */}
        <div className="xl:col-span-1 space-y-6">
          <Card className="sticky top-8">
            <h2 className="text-lg font-semibold mb-4">Тайминг</h2>
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#8E9299]">Длительность</span>
                <span className="font-mono text-white">{duration} сек</span>
              </div>
              <Slider value={duration} onChange={setDuration} max={30} />
            </div>

            <h2 className="text-lg font-semibold mb-4 pt-4 border-t border-[#222228]">Превью</h2>
            <div className="aspect-square bg-[#0A0A0C] rounded-xl border border-[#222228] flex items-center justify-center relative overflow-hidden checkerboard-bg">
              <div className={`flex w-full h-full justify-center ${activeVar.layout === 'side' ? 'flex-row items-center gap-4' : activeVar.layout === 'top' ? 'flex-col-reverse items-center' : 'flex-col items-center'} text-center p-4`}>
                <motion.div 
                  key={activeVar.id + 'img'}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-20 h-20 bg-[#222228] rounded-lg flex items-center justify-center shadow-lg shrink-0"
                >
                  <ImageIcon className="w-8 h-8 text-[#8E9299]" />
                </motion.div>
                <motion.div 
                  key={activeVar.id + 'text'}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={activeVar.layout === 'side' ? 'text-left' : 'mt-4'}
                >
                  <div className="font-bold text-lg drop-shadow-md leading-tight">
                    <span className="text-white">Almas B.</span><br/>
                    <span className="text-white font-normal text-sm">задонатил</span><br/>
                    <span style={{ color: activeVar.color }} className="text-2xl">{Math.max(activeVar.minAmount, 1000).toLocaleString()} ₸</span>
                  </div>
                  <div className="text-sm text-gray-200 mt-2 drop-shadow-md max-w-[150px] mx-auto">
                    Отличный стрим!
                  </div>
                </motion.div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

function LayoutOption({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
        active 
          ? 'bg-[#F14635]/10 border-[#F14635] text-[#F14635]' 
          : 'bg-[#0A0A0C] border-[#222228] text-[#8E9299] hover:border-gray-600 hover:text-white'
      }`}
    >
      {icon}
      <span className="text-xs font-medium mt-2">{label}</span>
    </button>
  );
}

function ColorPicker({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between p-3 bg-[#0A0A0C] border border-[#222228] rounded-xl">
      <span className="text-sm font-medium text-gray-300">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-[#8E9299] uppercase">{value}</span>
        <input 
          type="color" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-md cursor-pointer bg-transparent border-none p-0" 
        />
      </div>
    </div>
  );
}
