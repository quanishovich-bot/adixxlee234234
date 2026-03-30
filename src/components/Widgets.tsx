import { useState, memo, useEffect, useRef } from 'react';
import { Card } from './ui/Card';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Target, MessageSquare, Copy, CheckCircle2, Link as LinkIcon, Youtube, Edit2, CreditCard, X, Save, Plus, Trash2, QrCode, SlidersHorizontal, Palette, Settings as SettingsIcon, Sparkles, Heart, Zap, Star, Flame, Gem, Crown, Gift, Coffee, Music, Gamepad2, Rocket, Volume2, Play, Type, Upload } from 'lucide-react';

type WidgetStyle = 'glass' | 'solid' | 'neon' | 'minimal' | 'cyberpunk' | 'retro' | 'kawaii' | 'brutalist' | 'elegant' | 'electric' | 'hologram';
type AnimationType = 'none' | 'pulse' | 'bounce' | 'spin' | 'float';

const STYLES: { id: WidgetStyle; label: string }[] = [
  { id: 'glass', label: 'Стекло' },
  { id: 'solid', label: 'Сплошной' },
  { id: 'neon', label: 'Неон' },
  { id: 'minimal', label: 'Минимализм' },
  { id: 'cyberpunk', label: 'Киберпанк' },
  { id: 'retro', label: 'Ретро' },
  { id: 'kawaii', label: 'Каваи' },
  { id: 'brutalist', label: 'Брутализм' },
  { id: 'elegant', label: 'Элегантный' },
  { id: 'electric', label: 'Электро-рамка' },
  { id: 'hologram', label: 'Голограмма' },
];

const ANIMATIONS: { id: AnimationType; label: string; icon: any }[] = [
  { id: 'none', label: 'Нет', icon: X },
  { id: 'pulse', label: 'Пульсация', icon: Heart },
  { id: 'bounce', label: 'Прыжок', icon: Zap },
  { id: 'spin', label: 'Вращение', icon: Star },
  { id: 'float', label: 'Парение', icon: Sparkles },
];

const WIDGET_ICONS = [
  { id: 'heart', icon: Heart },
  { id: 'star', icon: Star },
  { id: 'zap', icon: Zap },
  { id: 'flame', icon: Flame },
  { id: 'gem', icon: Gem },
  { id: 'crown', icon: Crown },
  { id: 'gift', icon: Gift },
  { id: 'coffee', icon: Coffee },
  { id: 'music', icon: Music },
  { id: 'gamepad', icon: Gamepad2 },
  { id: 'rocket', icon: Rocket },
  { id: 'sparkles', icon: Sparkles },
  { id: 'message', icon: MessageSquare },
  { id: 'target', icon: Target },
  { id: 'trophy', icon: Trophy },
];

const FONTS = [
  { id: 'Inter', label: 'Inter (По умолчанию)' },
  { id: 'Roboto', label: 'Roboto' },
  { id: 'Montserrat', label: 'Montserrat' },
  { id: 'Oswald', label: 'Oswald' },
  { id: 'Playfair Display', label: 'Playfair Display' },
  { id: 'Press Start 2P', label: 'Press Start 2P (Ретро)' },
  { id: 'Caveat', label: 'Caveat (Рукописный)' },
];

const SOUNDS = [
  { id: 'none', label: 'Без звука' },
  { id: 'mario', label: 'Mario Coin', url: 'https://www.myinstants.com/media/sounds/mario-coin.mp3' },
  { id: 'wow', label: 'Anime Wow', url: 'https://www.myinstants.com/media/sounds/anime-wow-sound-effect.mp3' },
  { id: 'cash', label: 'Cash Register', url: 'https://www.myinstants.com/media/sounds/cash-register-kaching-sound-effect-audio-clear.mp3' },
  { id: 'custom', label: 'Свой звук (MP3)' },
];

export default function Widgets() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [widgetStyles, setWidgetStyles] = useState<Record<string, WidgetStyle>>({});
  const [editingWidget, setEditingWidget] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'specific' | 'sound'>('general');

  // Load fonts dynamically
  useEffect(() => {
    const fontsToLoad = new Set(Object.values(configs).map((c: any) => c.fontFamily).filter(Boolean));
    fontsToLoad.forEach(font => {
      const fontId = font.replace(/\s+/g, '+');
      if (!document.getElementById(`font-${fontId}`)) {
        const link = document.createElement('link');
        link.id = `font-${fontId}`;
        link.href = `https://fonts.googleapis.com/css2?family=${fontId}:wght@400;700;900&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
    });
  }, []); // Run once on mount, we'll also update it when configs change below

  // Widget Configurations State
  const [configs, setConfigs] = useState<Record<string, any>>({
    requisites: { 
      title: 'Поддержать стримера', 
      phone: '+7 777 123 4567', 
      name: 'Almas B.',
      showQr: true,
      scale: 1,
      primaryColor: '#F14635',
      animation: 'float',
      fontFamily: 'Inter',
      sound: 'none',
      volume: 1
    },
    'media-orders': { 
      minAmount: 500,
      showVideo: true,
      mediaType: 'youtube',
      mediaUrl: '',
      mediaName: '',
      scale: 1,
      primaryColor: '#F14635',
      animation: 'pulse',
      fontFamily: 'Inter',
      sound: 'none',
      volume: 1
    },
    'goal-map': { 
      goals: [
        { id: 1, title: 'Микрофон', target: 50000, current: 50000 },
        { id: 2, title: 'Вебкамера', target: 150000, current: 85000 },
        { id: 3, title: 'Новый ПК', target: 500000, current: 0 },
      ],
      scale: 1,
      primaryColor: '#F14635',
      animation: 'none',
      fontFamily: 'Inter',
      sound: 'none',
      volume: 1
    },
    'top-donators': { 
      count: 3, 
      period: 'all',
      scale: 1,
      primaryColor: '#F14635',
      animation: 'bounce',
      fontFamily: 'Inter',
      sound: 'none',
      volume: 1
    },
    'latest-alert': { 
      showAmount: true,
      scale: 1,
      primaryColor: '#F14635',
      animation: 'spin',
      fontFamily: 'Inter',
      sound: 'none',
      volume: 1
    }
  });

  // Load fonts when configs change
  useEffect(() => {
    const fontsToLoad = new Set(Object.values(configs).map((c: any) => c.fontFamily).filter(Boolean));
    fontsToLoad.forEach(font => {
      const fontId = font.replace(/\s+/g, '+');
      if (!document.getElementById(`font-${fontId}`)) {
        const link = document.createElement('link');
        link.id = `font-${fontId}`;
        link.href = `https://fonts.googleapis.com/css2?family=${fontId}:wght@400;700;900&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
    });
  }, [configs]);

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStyleChange = (widgetId: string, style: WidgetStyle) => {
    setWidgetStyles(prev => ({ ...prev, [widgetId]: style }));
  };

  const updateConfig = (widgetId: string, newConfig: any) => {
    setConfigs(prev => ({ ...prev, [widgetId]: { ...prev[widgetId], ...newConfig } }));
  };

  const WIDGET_DEFS = [
    {
      id: 'requisites',
      title: 'Реквизиты (QR и Карта)',
      description: 'Выведите этот блок на экран стрима. Зрители смогут отсканировать QR-код или переписать номер для быстрого перевода.',
      icon: CreditCard,
      url: 'http://localhost:3000/widget/requisites/kaspi_12345',
      previewComp: RequisitesPreview,
      type: 'static'
    },
    {
      id: 'media-orders',
      title: 'Медиа-заказы',
      description: 'Зрители могут прикреплять YouTube видео или GIF к донату. Появляется только при наличии медиа.',
      icon: Youtube,
      url: 'http://localhost:3000/widget/media/kaspi_12345',
      previewComp: MediaOrderPreview,
      type: 'event'
    },
    {
      id: 'goal-map',
      title: 'Карта целей (Milestones)',
      description: 'Несколько целей подряд. Позволяет зрителям видеть глобальный прогресс.',
      icon: Target,
      url: 'http://localhost:3000/widget/goals/kaspi_12345',
      previewComp: GoalMapPreview,
      type: 'static'
    },
    {
      id: 'top-donators',
      title: 'Топ донатеров',
      description: 'Отображает топ донатеров за стрим или за все время.',
      icon: Trophy,
      url: 'http://localhost:3000/widget/top-donators/kaspi_12345',
      previewComp: TopDonatorsPreview,
      type: 'static'
    },
    {
      id: 'latest-alert',
      title: 'Последний донат',
      description: 'Показывает имя и сумму последнего доната. Не появляется, если донат содержит медиа-заказ.',
      icon: MessageSquare,
      url: 'http://localhost:3000/widget/latest/kaspi_12345',
      previewComp: LatestAlertPreview,
      type: 'event'
    }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Виджеты для OBS</h1>
          <p className="text-[#8E9299] mt-1">Скопируйте ссылки на виджеты и добавьте их как Browser Source в OBS.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {WIDGET_DEFS.map((widget) => {
          const Icon = widget.icon;
          const currentStyle = widgetStyles[widget.id] || 'glass';
          const config = configs[widget.id] || {};
          const PreviewComp = widget.previewComp;
          
          return (
            <Card key={widget.id} className="flex flex-col h-full bg-[#141418] border-[#222228]">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#222228] flex items-center justify-center shadow-inner">
                    <Icon className="w-6 h-6 text-[#F14635]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{widget.title}</h2>
                    <p className="text-sm text-[#8E9299] mt-1 line-clamp-2">{widget.description}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setEditingWidget(widget.id)}
                  className="p-2.5 text-[#8E9299] hover:text-white bg-[#222228] hover:bg-[#2A2A32] rounded-xl transition-all shrink-0 flex items-center gap-2 shadow-sm hover:shadow-md" 
                  title="Настроить виджет"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="text-xs font-medium hidden sm:inline">Настроить</span>
                </button>
              </div>

              {/* Individual Style Selector */}
              <div className="mb-6">
                <label className="text-xs text-[#8E9299] font-bold uppercase tracking-widest mb-3 block flex items-center gap-2">
                  <Palette className="w-3 h-3" /> Стиль виджета
                </label>
                <div className="flex flex-wrap gap-2">
                  {STYLES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => handleStyleChange(widget.id, s.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                        currentStyle === s.id 
                          ? 'bg-[#F14635] text-white shadow-[0_4px_12px_rgba(241,70,53,0.3)] scale-105' 
                          : 'bg-[#0A0A0C] text-[#8E9299] border border-[#222228] hover:text-white hover:border-[#8E9299] hover:bg-[#1A1A20]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Area */}
              <div className="flex-1 bg-[#0A0A0C] rounded-2xl border border-[#222228] p-8 mb-6 flex items-center justify-center checkerboard-bg relative overflow-hidden min-h-[300px] shadow-inner">
                <div className="absolute top-3 right-3 px-3 py-1.5 bg-[#141418]/90 backdrop-blur-md rounded-lg text-[10px] text-[#8E9299] font-bold uppercase tracking-widest border border-[#222228] z-10 shadow-sm">
                  Превью
                </div>
                <div className="w-full flex items-center justify-center" style={{ transform: `scale(${config.scale || 1})` }}>
                  <PreviewComp themeStyle={currentStyle} config={config} />
                </div>
              </div>

              {/* URL Copy Area */}
              <div className="mt-auto">
                <div className="flex items-center gap-2 bg-[#0A0A0C] border border-[#222228] rounded-xl p-1.5 pl-4 shadow-inner">
                  <LinkIcon className="w-4 h-4 text-[#8E9299]" />
                  <input 
                    type="text" 
                    readOnly 
                    value={widget.url} 
                    className="bg-transparent border-none outline-none flex-1 text-sm font-mono text-gray-400"
                  />
                  <button 
                    onClick={() => handleCopy(widget.id, widget.url)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all text-sm font-bold shrink-0 ${
                      copiedId === widget.id 
                        ? 'bg-[#00E65B]/20 text-[#00E65B]' 
                        : 'bg-[#F14635] hover:bg-[#D93E2F] text-white shadow-[0_4px_12px_rgba(241,70,53,0.3)] hover:shadow-[0_6px_16px_rgba(241,70,53,0.4)]'
                    }`}
                  >
                    {copiedId === widget.id ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="hidden sm:inline">{copiedId === widget.id ? 'Скопировано' : 'Копировать'}</span>
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingWidget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#141418] border border-[#222228] rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#222228] bg-[#1A1A20]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#222228] flex items-center justify-center">
                    <SlidersHorizontal className="w-5 h-5 text-[#F14635]" />
                  </div>
                  <h2 className="text-xl font-bold">Настройка виджета</h2>
                </div>
                <button onClick={() => setEditingWidget(null)} className="p-2 text-[#8E9299] hover:text-white hover:bg-[#222228] rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-center gap-6 px-6 border-b border-[#222228] bg-[#1A1A20]">
                <button onClick={() => setActiveTab('general')} className={`py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'general' ? 'border-[#F14635] text-[#F14635]' : 'border-transparent text-[#8E9299] hover:text-white'}`}>Общие</button>
                <button onClick={() => setActiveTab('specific')} className={`py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'specific' ? 'border-[#F14635] text-[#F14635]' : 'border-transparent text-[#8E9299] hover:text-white'}`}>Специфичные</button>
                {WIDGET_DEFS.find(w => w.id === editingWidget)?.type === 'event' && (
                  <button onClick={() => setActiveTab('sound')} className={`py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'sound' ? 'border-[#F14635] text-[#F14635]' : 'border-transparent text-[#8E9299] hover:text-white'}`}>Звук</button>
                )}
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#8E9299] mb-2">Масштаб виджета</label>
                        <input 
                          type="range" 
                          min="0.5" max="2" step="0.1"
                          value={configs[editingWidget]?.scale || 1}
                          onChange={(e) => updateConfig(editingWidget, { scale: Number(e.target.value) })}
                          className="w-full accent-[#F14635]"
                        />
                        <div className="text-right text-xs text-gray-400 mt-1">{configs[editingWidget]?.scale || 1}x</div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#8E9299] mb-2">Основной цвет</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="color" 
                            value={configs[editingWidget]?.primaryColor || '#F14635'}
                            onChange={(e) => updateConfig(editingWidget, { primaryColor: e.target.value })}
                            className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent p-0"
                          />
                          <span className="text-xs font-mono text-gray-400">{configs[editingWidget]?.primaryColor || '#F14635'}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#8E9299] mb-2">Шрифт (Google Fonts)</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {FONTS.map(font => (
                          <button
                            key={font.id}
                            onClick={() => updateConfig(editingWidget, { fontFamily: font.id })}
                            className={`p-3 rounded-xl border text-left transition-colors ${configs[editingWidget]?.fontFamily === font.id ? 'bg-[#F14635]/10 border-[#F14635] text-[#F14635]' : 'bg-[#0A0A0C] border-[#222228] text-white hover:border-[#8E9299]'}`}
                            style={{ fontFamily: font.id }}
                          >
                            {font.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#8E9299] mb-2">Иконка виджета</label>
                      <div className="grid grid-cols-5 sm:grid-cols-8 gap-2 mb-4">
                        {WIDGET_ICONS.map(iconObj => {
                          const Icon = iconObj.icon;
                          const isActive = (configs[editingWidget]?.widgetIcon || (editingWidget === 'requisites' ? 'heart' : editingWidget === 'media-orders' ? 'music' : editingWidget === 'goal-map' ? 'target' : editingWidget === 'top-donators' ? 'trophy' : 'message')) === iconObj.id;
                          return (
                            <button
                              key={iconObj.id}
                              onClick={() => updateConfig(editingWidget, { widgetIcon: iconObj.id })}
                              className={`flex items-center justify-center p-2 rounded-xl border transition-all ${
                                isActive 
                                  ? 'bg-[#F14635]/10 border-[#F14635] text-[#F14635]' 
                                  : 'bg-[#0A0A0C] border-[#222228] text-[#8E9299] hover:border-[#8E9299] hover:text-white'
                              }`}
                              title={iconObj.id}
                            >
                              <Icon className="w-5 h-5" />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {WIDGET_DEFS.find(w => w.id === editingWidget)?.type === 'event' && (
                      <div>
                        <label className="block text-xs font-medium text-[#8E9299] mb-2">Анимация появления</label>
                        <div className="grid grid-cols-5 gap-2">
                          {ANIMATIONS.map(anim => {
                            const Icon = anim.icon;
                            const isActive = configs[editingWidget]?.animation === anim.id;
                            return (
                              <button
                                key={anim.id}
                                onClick={() => updateConfig(editingWidget, { animation: anim.id })}
                                className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border transition-all ${
                                  isActive 
                                    ? 'bg-[#F14635]/10 border-[#F14635] text-[#F14635]' 
                                    : 'bg-[#0A0A0C] border-[#222228] text-[#8E9299] hover:border-[#8E9299] hover:text-white'
                                }`}
                                title={anim.label}
                              >
                                <Icon className="w-4 h-4" />
                                <span className="text-[10px] font-medium">{anim.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'sound' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-medium text-[#8E9299] mb-2">Звук при появлении</label>
                      <div className="space-y-2">
                        {SOUNDS.map(sound => (
                          <label key={sound.id} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${configs[editingWidget]?.sound === sound.id ? 'bg-[#F14635]/10 border-[#F14635]' : 'bg-[#0A0A0C] border-[#222228] hover:border-[#8E9299]'}`}>
                            <div className="flex items-center gap-3">
                              <input type="radio" name="sound" checked={configs[editingWidget]?.sound === sound.id} onChange={() => updateConfig(editingWidget, { sound: sound.id })} className="hidden" />
                              <span className={`text-sm font-medium ${configs[editingWidget]?.sound === sound.id ? 'text-[#F14635]' : 'text-white'}`}>{sound.label}</span>
                            </div>
                            {sound.url && (
                              <button onClick={(e) => { e.preventDefault(); const audio = new Audio(sound.url); audio.volume = configs[editingWidget]?.volume || 1; audio.play(); }} className="p-1.5 rounded-lg bg-[#222228] hover:bg-[#2A2A32] text-white transition-colors">
                                <Play className="w-4 h-4" />
                              </button>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {configs[editingWidget]?.sound === 'custom' && (
                      <div>
                        <label className="block text-xs font-medium text-[#8E9299] mb-2">Загрузить аудио файл (MP3, WAV)</label>
                        <div className="flex items-center gap-3">
                          <label className="flex-1 cursor-pointer bg-[#0A0A0C] border border-[#222228] hover:border-[#F14635] rounded-xl px-4 py-3 text-white transition-colors flex items-center justify-between">
                            <span className="text-sm truncate mr-2">
                              {configs[editingWidget]?.customSoundName || 'Выберите файл...'}
                            </span>
                            <Upload className="w-4 h-4 text-[#8E9299]" />
                            <input 
                              type="file" 
                              accept="audio/*" 
                              className="hidden" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    updateConfig(editingWidget, { 
                                      customSoundUrl: event.target?.result as string,
                                      customSoundName: file.name
                                    });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }} 
                            />
                          </label>
                          {configs[editingWidget]?.customSoundUrl && (
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                const audio = new Audio(configs[editingWidget].customSoundUrl);
                                audio.volume = configs[editingWidget]?.volume || 1;
                                audio.play();
                              }} 
                              className="p-3 rounded-xl bg-[#222228] hover:bg-[#2A2A32] text-white transition-colors"
                            >
                              <Play className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-medium text-[#8E9299] mb-2">Громкость</label>
                      <div className="flex items-center gap-3">
                        <Volume2 className="w-4 h-4 text-[#8E9299]" />
                        <input type="range" min="0" max="1" step="0.05" value={configs[editingWidget]?.volume ?? 1} onChange={(e) => updateConfig(editingWidget, { volume: Number(e.target.value) })} className="flex-1 accent-[#F14635]" />
                        <span className="text-xs font-mono text-gray-400">{Math.round((configs[editingWidget]?.volume ?? 1) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'specific' && (
                  <div className="space-y-6">
                  
                  {editingWidget === 'requisites' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#8E9299] mb-1">Заголовок</label>
                        <input 
                          type="text" 
                          value={configs['requisites'].title}
                          onChange={(e) => updateConfig('requisites', { title: e.target.value })}
                          className="w-full bg-[#0A0A0C] border border-[#222228] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F14635] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#8E9299] mb-1">Номер телефона или карты</label>
                        <input 
                          type="text" 
                          value={configs['requisites'].phone}
                          onChange={(e) => updateConfig('requisites', { phone: e.target.value })}
                          className="w-full bg-[#0A0A0C] border border-[#222228] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F14635] transition-colors font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#8E9299] mb-1">Имя получателя</label>
                        <input 
                          type="text" 
                          value={configs['requisites'].name}
                          onChange={(e) => updateConfig('requisites', { name: e.target.value })}
                          className="w-full bg-[#0A0A0C] border border-[#222228] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F14635] transition-colors"
                        />
                      </div>
                      <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-[#222228] bg-[#0A0A0C] hover:bg-[#1A1A20] transition-colors">
                        <input 
                          type="checkbox" 
                          checked={configs['requisites'].showQr}
                          onChange={(e) => updateConfig('requisites', { showQr: e.target.checked })}
                          className="w-5 h-5 rounded border-[#222228] bg-[#141418] text-[#F14635] focus:ring-[#F14635] focus:ring-offset-[#141418]"
                        />
                        <span className="text-sm font-medium text-white flex items-center gap-2"><QrCode className="w-4 h-4 text-[#8E9299]"/> Показывать QR-код</span>
                      </label>
                    </div>
                  )}

                  {editingWidget === 'media-orders' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#8E9299] mb-1">Минимальная сумма для заказа медиа (₸)</label>
                        <input 
                          type="number" 
                          value={configs['media-orders'].minAmount}
                          onChange={(e) => updateConfig('media-orders', { minAmount: Number(e.target.value) })}
                          className="w-full bg-[#0A0A0C] border border-[#222228] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F14635] transition-colors"
                        />
                      </div>
                      <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-[#222228] bg-[#0A0A0C] hover:bg-[#1A1A20] transition-colors">
                        <input 
                          type="checkbox" 
                          checked={configs['media-orders'].showVideo}
                          onChange={(e) => updateConfig('media-orders', { showVideo: e.target.checked })}
                          className="w-5 h-5 rounded border-[#222228] bg-[#141418] text-[#F14635] focus:ring-[#F14635] focus:ring-offset-[#141418]"
                        />
                        <span className="text-sm font-medium text-white flex items-center gap-2"><Youtube className="w-4 h-4 text-[#8E9299]"/> Показывать медиа-плеер</span>
                      </label>
                      
                      {configs['media-orders'].showVideo && (
                        <div className="p-4 bg-[#0A0A0C] border border-[#222228] rounded-xl space-y-4">
                          <label className="block text-sm font-medium text-[#8E9299] mb-2">Тестовое медиа для превью</label>
                          <div className="flex gap-2 mb-4">
                            <button 
                              onClick={() => updateConfig('media-orders', { mediaType: 'youtube' })}
                              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${configs['media-orders'].mediaType !== 'gif' ? 'bg-[#F14635] text-white' : 'bg-[#222228] text-[#8E9299] hover:text-white'}`}
                            >
                              YouTube
                            </button>
                            <button 
                              onClick={() => updateConfig('media-orders', { mediaType: 'gif' })}
                              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${configs['media-orders'].mediaType === 'gif' ? 'bg-[#F14635] text-white' : 'bg-[#222228] text-[#8E9299] hover:text-white'}`}
                            >
                              GIF / Изображение
                            </button>
                          </div>
                          
                          {configs['media-orders'].mediaType === 'gif' ? (
                            <div>
                              <label className="flex-1 cursor-pointer bg-[#141418] border border-[#222228] hover:border-[#F14635] rounded-xl px-4 py-3 text-white transition-colors flex items-center justify-between">
                                <span className="text-sm truncate mr-2">
                                  {configs['media-orders'].mediaName || 'Загрузить GIF...'}
                                </span>
                                <Upload className="w-4 h-4 text-[#8E9299]" />
                                <input 
                                  type="file" 
                                  accept="image/gif,image/jpeg,image/png,image/webp" 
                                  className="hidden" 
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = (event) => {
                                        updateConfig('media-orders', { 
                                          mediaUrl: event.target?.result as string,
                                          mediaName: file.name
                                        });
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }} 
                                />
                              </label>
                            </div>
                          ) : (
                            <div className="text-xs text-[#8E9299] text-center p-2">
                              Для YouTube будет отображаться стандартный плеер.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {editingWidget === 'goal-map' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-[#8E9299]">Список целей</label>
                        <button 
                          onClick={() => {
                            const newGoals = [...configs['goal-map'].goals, { id: Date.now(), title: 'Новая цель', target: 10000, current: 0 }];
                            updateConfig('goal-map', { goals: newGoals });
                          }}
                          className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F14635]/10 text-[#F14635] hover:bg-[#F14635]/20 font-bold transition-colors"
                        >
                          <Plus className="w-3 h-3" /> Добавить
                        </button>
                      </div>
                      
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        {configs['goal-map'].goals.map((goal: any, index: number) => (
                          <div key={goal.id} className="bg-[#0A0A0C] border border-[#222228] rounded-xl p-4 space-y-3 relative group">
                            <button 
                              onClick={() => {
                                const newGoals = configs['goal-map'].goals.filter((g: any) => g.id !== goal.id);
                                updateConfig('goal-map', { goals: newGoals });
                              }}
                              className="absolute top-2 right-2 p-1.5 text-[#8E9299] hover:text-[#FF4444] bg-[#141418] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            
                            <div>
                              <label className="block text-xs text-[#8E9299] mb-1">Название</label>
                              <input 
                                type="text" 
                                value={goal.title}
                                onChange={(e) => {
                                  const newGoals = [...configs['goal-map'].goals];
                                  newGoals[index].title = e.target.value;
                                  updateConfig('goal-map', { goals: newGoals });
                                }}
                                className="w-full bg-[#141418] border border-[#222228] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#F14635]"
                              />
                            </div>
                            <div className="flex gap-3">
                              <div className="flex-1">
                                <label className="block text-xs text-[#8E9299] mb-1">Собрано</label>
                                <input 
                                  type="number" 
                                  value={goal.current}
                                  onChange={(e) => {
                                    const newGoals = [...configs['goal-map'].goals];
                                    newGoals[index].current = Number(e.target.value);
                                    updateConfig('goal-map', { goals: newGoals });
                                  }}
                                  className="w-full bg-[#141418] border border-[#222228] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#F14635]"
                                />
                              </div>
                              <div className="flex-1">
                                <label className="block text-xs text-[#8E9299] mb-1">Цель</label>
                                <input 
                                  type="number" 
                                  value={goal.target}
                                  onChange={(e) => {
                                    const newGoals = [...configs['goal-map'].goals];
                                    newGoals[index].target = Number(e.target.value);
                                    updateConfig('goal-map', { goals: newGoals });
                                  }}
                                  className="w-full bg-[#141418] border border-[#222228] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#F14635]"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {editingWidget === 'top-donators' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#8E9299] mb-1">Количество мест</label>
                        <select 
                          value={configs['top-donators'].count}
                          onChange={(e) => updateConfig('top-donators', { count: Number(e.target.value) })}
                          className="w-full bg-[#0A0A0C] border border-[#222228] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F14635] transition-colors appearance-none"
                        >
                          <option value={3}>Топ 3</option>
                          <option value={5}>Топ 5</option>
                          <option value={10}>Топ 10</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#8E9299] mb-1">Период</label>
                        <select 
                          value={configs['top-donators'].period}
                          onChange={(e) => updateConfig('top-donators', { period: e.target.value })}
                          className="w-full bg-[#0A0A0C] border border-[#222228] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F14635] transition-colors appearance-none"
                        >
                          <option value="stream">За текущий стрим</option>
                          <option value="month">За месяц</option>
                          <option value="all">За все время</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {editingWidget === 'latest-alert' && (
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-[#222228] bg-[#0A0A0C] hover:bg-[#1A1A20] transition-colors">
                        <input 
                          type="checkbox" 
                          checked={configs['latest-alert'].showAmount}
                          onChange={(e) => updateConfig('latest-alert', { showAmount: e.target.checked })}
                          className="w-5 h-5 rounded border-[#222228] bg-[#141418] text-[#F14635] focus:ring-[#F14635] focus:ring-offset-[#141418]"
                        />
                        <span className="text-sm font-medium text-white">Показывать сумму доната</span>
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-[#222228] bg-[#1A1A20] flex justify-end gap-3">
                <button 
                  onClick={() => setEditingWidget(null)}
                  className="px-6 py-2.5 rounded-xl font-bold text-white hover:bg-[#222228] transition-colors"
                >
                  Отмена
                </button>
                <button 
                  onClick={() => setEditingWidget(null)}
                  className="px-6 py-2.5 rounded-xl font-bold bg-[#F14635] hover:bg-[#D93E2F] text-white transition-colors flex items-center gap-2 shadow-[0_4px_12px_rgba(241,70,53,0.3)]"
                >
                  <Save className="w-4 h-4" /> Сохранить
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- Helper for Styles ---
function getContainerStyle(theme: WidgetStyle, primaryColor: string) {
  switch (theme) {
    case 'glass': return 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-white rounded-2xl';
    case 'solid': return 'bg-[#1A1A20] border border-[#2A2A32] shadow-2xl text-white rounded-2xl';
    case 'neon': return `bg-black border-2 shadow-[0_0_30px_rgba(0,0,0,0.5)] text-white rounded-xl`;
    case 'minimal': return 'bg-transparent border-2 border-white/10 text-white rounded-none';
    case 'cyberpunk': return 'bg-[#FCEE0A] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black font-mono uppercase rounded-none';
    case 'retro': return 'bg-[#c0c0c0] border-t-4 border-l-4 border-white border-b-4 border-r-4 border-gray-800 text-black font-mono rounded-none';
    case 'kawaii': return 'bg-[#FFE4E1] border-4 border-[#FFB6C1] rounded-[2rem] shadow-[0_8px_0_0_#FFB6C1] text-[#FF69B4] font-sans';
    case 'brutalist': return 'bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-black font-black uppercase rounded-none';
    case 'elegant': return 'bg-gradient-to-br from-gray-900 to-black border border-[#D4AF37] shadow-[0_10px_40px_rgba(212,175,55,0.15)] text-[#D4AF37] font-serif rounded-sm';
    case 'electric': return 'electric-border text-white';
    case 'hologram': return 'hologram-effect text-[#00FFFF] border border-[#00FFFF]/50 rounded-xl';
    default: return 'bg-[#141418] border border-[#222228] text-white rounded-xl';
  }
}

// --- Helpers ---
function getWidgetIcon(iconId: string, defaultIcon: any) {
  const found = WIDGET_ICONS.find(i => i.id === iconId);
  return found ? found.icon : defaultIcon;
}

function getAnimationProps(animation: AnimationType) {
  switch (animation) {
    case 'pulse':
      return {
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: [1, 1.05, 1], opacity: 1 },
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      };
    case 'bounce':
      return {
        initial: { y: -50, opacity: 0 },
        animate: { y: [0, -20, 0], opacity: 1 },
        transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
      };
    case 'spin':
      return {
        initial: { rotate: -180, opacity: 0 },
        animate: { rotate: 0, opacity: 1 },
        transition: { type: "spring", stiffness: 100, damping: 10 }
      };
    case 'float':
      return {
        initial: { y: 20, opacity: 0 },
        animate: { y: [0, -10, 0], opacity: 1 },
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      };
    case 'none':
    default:
      return {
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { duration: 0.3 }
      };
  }
}

// --- Preview Components ---

const RequisitesPreview = memo(function RequisitesPreview({ themeStyle, config }: { themeStyle: WidgetStyle, config: any }) {
  const isDarkText = ['cyberpunk', 'retro', 'brutalist'].includes(themeStyle);
  const primaryColor = config.primaryColor || '#F14635';
  const animProps = getAnimationProps(config.animation || 'none');
  const Icon = getWidgetIcon(config.widgetIcon, Heart);
  
  return (
    <motion.div 
      {...animProps}
      className={`w-full max-w-sm p-8 flex flex-col items-center gap-6 ${getContainerStyle(themeStyle, primaryColor)}`}
      style={{
        fontFamily: config.fontFamily || 'Inter',
        ...(themeStyle === 'neon' ? { borderColor: primaryColor, boxShadow: `0 0 20px ${primaryColor}40, inset 0 0 10px ${primaryColor}20` } : {})
      }}
    >
      <h3 className={`font-bold text-xl tracking-wider text-center flex items-center justify-center gap-2 ${isDarkText ? '' : 'text-white'}`} style={themeStyle === 'neon' ? { textShadow: `0 0 10px ${primaryColor}` } : {}}>
        <Icon className="w-6 h-6" />
        {config.title || 'Поддержать стримера'}
      </h3>
      
      {config.showQr && (
        <div className={`p-4 bg-white rounded-xl shadow-inner ${themeStyle === 'cyberpunk' ? 'border-4 border-black rounded-none' : ''}`}>
          <QrCode className="w-32 h-32 text-black" />
        </div>
      )}
      
      <div className="flex flex-col items-center justify-center w-full text-center">
        <div className={`text-xs font-bold uppercase tracking-widest mb-2 opacity-70`}>Kaspi.kz</div>
        <div className={`font-mono font-bold text-3xl tracking-widest mb-2`} style={themeStyle === 'neon' ? { color: primaryColor, textShadow: `0 0 10px ${primaryColor}` } : {}}>
          {config.phone || '+7 777 123 4567'}
        </div>
        <div className={`font-medium tracking-widest uppercase text-sm opacity-90`}>
          {config.name || 'Almas B.'}
        </div>
      </div>
    </motion.div>
  );
});

const MediaOrderPreview = memo(function MediaOrderPreview({ themeStyle, config }: { themeStyle: WidgetStyle, config: any }) {
  const isDarkText = ['cyberpunk', 'retro', 'brutalist'].includes(themeStyle);
  const primaryColor = config.primaryColor || '#F14635';
  const animProps = getAnimationProps(config.animation || 'none');
  const Icon = getWidgetIcon(config.widgetIcon, Music);
  
  return (
    <motion.div 
      {...animProps}
      className={`w-full max-w-md p-6 ${getContainerStyle(themeStyle, primaryColor)}`}
      style={{
        fontFamily: config.fontFamily || 'Inter',
        ...(themeStyle === 'neon' ? { borderColor: primaryColor, boxShadow: `0 0 20px ${primaryColor}40, inset 0 0 10px ${primaryColor}20` } : {})
      }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white shadow-lg text-lg border-2 border-white/20">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <div className={`font-bold text-lg ${isDarkText ? '' : 'text-white'}`}>
            DarkSlayer99 <span className="font-mono ml-2" style={{ color: isDarkText ? 'inherit' : primaryColor, textShadow: themeStyle === 'neon' ? `0 0 10px ${primaryColor}` : 'none' }}>{config.minAmount || 500} ₸</span>
          </div>
          <div className={`text-sm mt-0.5 ${isDarkText ? 'opacity-80' : 'text-gray-300'}`}>Зацени этот эпичный момент!</div>
        </div>
      </div>
      
      {config.showVideo && (
        <div className={`relative aspect-video bg-black overflow-hidden ${themeStyle === 'cyberpunk' || themeStyle === 'brutalist' || themeStyle === 'retro' ? 'border-4 border-black' : 'rounded-xl border border-white/10'}`}>
          {config.mediaType === 'gif' && config.mediaUrl ? (
            <img src={config.mediaUrl} alt="GIF" className="w-full h-full object-cover" />
          ) : (
            <>
              <img src="https://picsum.photos/seed/gaming/600/338" alt="Video thumbnail" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm bg-black/50 border border-white/20 transition-transform hover:scale-110">
                  <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
                <div className="h-full w-1/3" style={{ backgroundColor: primaryColor, boxShadow: themeStyle === 'neon' ? `0 0 10px ${primaryColor}` : 'none' }}></div>
              </div>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
});

const GoalMapPreview = memo(function GoalMapPreview({ themeStyle, config }: { themeStyle: WidgetStyle, config: any }) {
  const isDarkText = ['cyberpunk', 'retro', 'brutalist'].includes(themeStyle);
  const primaryColor = config.primaryColor || '#F14635';
  const goals = config.goals || [];
  const animProps = getAnimationProps(config.animation || 'none');
  const Icon = getWidgetIcon(config.widgetIcon, Target);

  return (
    <motion.div 
      {...animProps}
      className={`w-full max-w-sm p-6 ${getContainerStyle(themeStyle, primaryColor)}`}
      style={{
        fontFamily: config.fontFamily || 'Inter',
        ...(themeStyle === 'neon' ? { borderColor: primaryColor, boxShadow: `0 0 20px ${primaryColor}40, inset 0 0 10px ${primaryColor}20` } : {})
      }}
    >
      <h3 className={`font-bold text-base mb-6 uppercase tracking-widest flex items-center gap-2 justify-center ${isDarkText ? '' : 'text-white'}`} style={themeStyle === 'neon' ? { textShadow: `0 0 10px ${primaryColor}` } : {}}>
        <Icon className="w-5 h-5" /> Карта целей
      </h3>
      
      <div className="space-y-5 relative before:absolute before:inset-0 before:ml-[13px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-current before:via-current/30 before:to-current/10">
        {goals.map((g: any, i: number) => {
          const isDone = g.current >= g.target;
          const percent = Math.min(100, Math.round((g.current / g.target) * 100)) || 0;
          return (
            <div key={g.id || i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              {/* Marker */}
              <div className={`flex items-center justify-center w-7 h-7 rounded-full border-4 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md z-10 ${isDone ? 'text-white' : g.current > 0 ? 'bg-white' : 'bg-transparent'}`} style={{ borderColor: isDone ? primaryColor : 'currentColor', backgroundColor: isDone ? primaryColor : undefined }}>
                {isDone && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
              
              {/* Card */}
              <div className={`w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] p-4 shadow-md ${themeStyle === 'cyberpunk' || themeStyle === 'brutalist' || themeStyle === 'retro' ? 'border-2 border-black' : 'rounded-xl border border-white/10'} ${isDarkText ? 'bg-white/80' : 'bg-black/40 backdrop-blur-md'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`font-bold text-sm ${isDone ? 'opacity-50 line-through' : ''}`}>{g.title}</span>
                  <span className="text-xs font-mono font-bold" style={{ color: isDone ? 'inherit' : primaryColor }}>{percent}%</span>
                </div>
                <div className={`h-2 overflow-hidden ${themeStyle === 'cyberpunk' || themeStyle === 'brutalist' || themeStyle === 'retro' ? 'border border-black' : 'rounded-full'} ${isDarkText ? 'bg-black/10' : 'bg-white/10'}`}>
                  <div className={`h-full transition-all duration-1000`} style={{ width: `${percent}%`, backgroundColor: isDone ? (isDarkText ? '#888' : '#555') : primaryColor, boxShadow: themeStyle === 'neon' && !isDone ? `0 0 10px ${primaryColor}` : 'none' }}></div>
                </div>
                <div className={`text-xs font-mono mt-2 text-right ${isDarkText ? 'opacity-80 font-bold' : 'text-gray-400'}`}>
                  {g.current.toLocaleString()} / {g.target.toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
});

const TopDonatorsPreview = memo(function TopDonatorsPreview({ themeStyle, config }: { themeStyle: WidgetStyle, config: any }) {
  const isDarkText = ['cyberpunk', 'retro', 'brutalist'].includes(themeStyle);
  const primaryColor = config.primaryColor || '#F14635';
  const animProps = getAnimationProps(config.animation || 'none');
  const Icon = getWidgetIcon(config.widgetIcon, Trophy);
  const donators = [
    { name: 'Almas B.', amount: '50 000 ₸', color: '#FFD700' }, // Gold
    { name: 'Zhanar', amount: '15 000 ₸', color: '#C0C0C0' }, // Silver
    { name: 'Darkhan', amount: '5 000 ₸', color: '#CD7F32' }, // Bronze
    { name: 'Aibek', amount: '2 000 ₸', color: isDarkText ? '#555' : '#8E9299' },
    { name: 'User123', amount: '1 000 ₸', color: isDarkText ? '#555' : '#8E9299' },
    { name: 'Anon', amount: '500 ₸', color: isDarkText ? '#555' : '#8E9299' },
    { name: 'Gamer99', amount: '500 ₸', color: isDarkText ? '#555' : '#8E9299' },
    { name: 'Test', amount: '100 ₸', color: isDarkText ? '#555' : '#8E9299' },
    { name: 'Hello', amount: '100 ₸', color: isDarkText ? '#555' : '#8E9299' },
    { name: 'World', amount: '100 ₸', color: isDarkText ? '#555' : '#8E9299' },
  ].slice(0, config.count || 3);

  return (
    <motion.div 
      {...animProps}
      className={`w-full max-w-sm p-6 ${getContainerStyle(themeStyle, primaryColor)}`}
      style={{
        fontFamily: config.fontFamily || 'Inter',
        ...(themeStyle === 'neon' ? { borderColor: primaryColor, boxShadow: `0 0 20px ${primaryColor}40, inset 0 0 10px ${primaryColor}20` } : {})
      }}
    >
      <h3 className={`text-center font-bold text-base mb-5 uppercase tracking-widest flex items-center justify-center gap-2 ${isDarkText ? '' : 'text-white'}`} style={themeStyle === 'neon' ? { textShadow: `0 0 10px ${primaryColor}` } : {}}>
        <Icon className="w-5 h-5" />
        Топ Донатеров {config.period === 'month' ? '(Месяц)' : config.period === 'stream' ? '(Стрим)' : ''}
      </h3>
      <div className="space-y-3">
        {donators.map((d, i) => (
          <div key={i} className={`flex items-center justify-between p-3 shadow-sm ${themeStyle === 'cyberpunk' || themeStyle === 'brutalist' || themeStyle === 'retro' ? 'border-2 border-black' : 'rounded-xl border border-white/10'} ${isDarkText ? 'bg-white/80' : 'bg-black/40 backdrop-blur-md'}`}>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-inner" style={{ backgroundColor: `${d.color}20`, color: d.color, border: `2px solid ${d.color}60` }}>
                {i + 1}
              </div>
              <span className={`font-bold text-base ${isDarkText ? '' : 'text-gray-100'}`}>{d.name}</span>
            </div>
            <span className="font-mono font-bold text-base" style={{ color: i < 3 ? d.color : 'inherit' }}>{d.amount}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
});

const LatestAlertPreview = memo(function LatestAlertPreview({ themeStyle, config }: { themeStyle: WidgetStyle, config: any }) {
  const isDarkText = ['cyberpunk', 'retro', 'brutalist'].includes(themeStyle);
  const primaryColor = config.primaryColor || '#F14635';
  const animProps = getAnimationProps(config.animation || 'none');
  const Icon = getWidgetIcon(config.widgetIcon, MessageSquare);
  
  return (
    <motion.div 
      {...animProps}
      className={`w-full max-w-sm p-5 flex items-center gap-4 ${getContainerStyle(themeStyle, primaryColor)}`}
      style={{
        fontFamily: config.fontFamily || 'Inter',
        ...(themeStyle === 'neon' ? { borderColor: primaryColor, boxShadow: `0 0 20px ${primaryColor}40, inset 0 0 10px ${primaryColor}20` } : {})
      }}
    >
      <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 shadow-lg" style={{ borderColor: primaryColor, backgroundColor: `${primaryColor}20`, color: primaryColor }}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${isDarkText ? 'opacity-70' : 'text-gray-400'}`}>Последний донат</div>
        <div className="flex items-baseline justify-between gap-3 truncate">
          <span className={`font-bold text-lg truncate ${isDarkText ? '' : 'text-white'}`} style={themeStyle === 'neon' ? { textShadow: `0 0 10px ${primaryColor}` } : {}}>Zhanar</span>
          {config.showAmount !== false && (
            <span className="font-mono font-bold text-lg shrink-0" style={{ color: primaryColor, textShadow: themeStyle === 'neon' ? `0 0 10px ${primaryColor}` : 'none' }}>2 000 ₸</span>
          )}
        </div>
      </div>
    </motion.div>
  );
});
