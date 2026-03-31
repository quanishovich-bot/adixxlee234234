import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSocket } from '../lib/SocketContext';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Heart, Music, Target, Trophy, CheckCircle2, Zap, Star, Flame, Gem, Crown, Gift, Coffee, Gamepad2, Rocket, Sparkles } from 'lucide-react';
import ReactPlayer from 'react-player';

const extractYouTubeUrl = (text: string) => {
  const urlRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = text?.match(urlRegex);
  return match ? `https://www.youtube.com/watch?v=${match[1]}` : null;
};

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

function getWidgetIcon(iconId: string, defaultIcon: any) {
  const found = WIDGET_ICONS.find(i => i.id === iconId);
  return found ? found.icon : defaultIcon;
}

// --- Helper for Styles ---
function getContainerStyle(theme: string, primaryColor: string) {
  switch (theme) {
    case 'glass': return 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-white rounded-2xl';
    case 'solid': return 'bg-[#1A1A20] border border-[#2A2A32] shadow-2xl text-white rounded-2xl';
    case 'neon': return `bg-black border-2 shadow-[0_0_30px_rgba(0,0,0,0.5)] text-white rounded-xl`;
    case 'minimal': return 'bg-transparent border-2 border-white/10 text-white rounded-none';
    case 'brutalist': return 'bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-black font-black uppercase rounded-none';
    default: return 'bg-[#141418] border border-[#222228] text-white rounded-xl';
  }
}

function getAnimationProps(animation: string) {
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

export default function WidgetRenderer() {
  const { type, id } = useParams();
  const [searchParams] = useSearchParams();
  const { socket, donations } = useSocket();
  const [currentAlert, setCurrentAlert] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const themeStyle = searchParams.get('style') || 'glass';
  const configStr = searchParams.get('config');
  const config = configStr ? JSON.parse(configStr) : {};
  const primaryColor = config.primaryColor || '#F14635';
  const isDarkText = ['brutalist'].includes(themeStyle);

  // Load font
  useEffect(() => {
    if (config.fontFamily) {
      const fontId = config.fontFamily.replace(/\s+/g, '+');
      if (!document.getElementById(`font-${fontId}`)) {
        const link = document.createElement('link');
        link.id = `font-${fontId}`;
        link.href = `https://fonts.googleapis.com/css2?family=${fontId}:wght@400;700;900&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
    }
  }, [config.fontFamily]);

  // For the 'latest' and 'media' alert widgets
  useEffect(() => {
    if ((type === 'latest' || type === 'media') && socket) {
      const handleNewDonation = (donation: any) => {
        // If it's a media widget, only show if there's a YouTube link
        const hasMedia = extractYouTubeUrl(donation.message);
        
        if (type === 'media' && !hasMedia) return;
        if (type === 'latest' && hasMedia) return; // Don't show in latest if it's a media order

        setCurrentAlert(donation);
        
        // Play sound if configured
        if (config.sound && config.sound !== 'none') {
          const audioUrl = config.sound === 'custom' ? config.customSoundUrl : 
            config.sound === 'mario' ? 'https://www.myinstants.com/media/sounds/mario-coin.mp3' :
            config.sound === 'wow' ? 'https://www.myinstants.com/media/sounds/anime-wow-sound-effect.mp3' :
            config.sound === 'cash' ? 'https://www.myinstants.com/media/sounds/cash-register-kaching-sound-effect-audio-clear.mp3' : null;
          
          if (audioUrl) {
            const audio = new Audio(audioUrl);
            audio.volume = config.volume || 1;
            audio.play().catch(e => console.error("Audio play failed:", e));
          }
        }

        if (type === 'latest') {
          // Hide alert after 8 seconds
          setTimeout(() => {
            setCurrentAlert(null);
          }, 8000);
        } else if (type === 'media') {
          setIsPlaying(true);
        }
      };

      const handleSkipMedia = () => {
        if (type === 'media') {
          setIsPlaying(false);
          setCurrentAlert(null);
        }
      };

      socket.on('new_donation', handleNewDonation);
      socket.on('skip_media', handleSkipMedia);
      
      return () => {
        socket.off('new_donation', handleNewDonation);
        socket.off('skip_media', handleSkipMedia);
      };
    }
  }, [socket, type, config]);

  // Handle media end
  const handleMediaEnd = () => {
    setIsPlaying(false);
    setCurrentAlert(null);
  };

  const containerStyle = getContainerStyle(themeStyle, primaryColor);
  const animProps = getAnimationProps(config.animation || 'none');
  const fontStyle = { fontFamily: config.fontFamily || 'Inter' };
  const neonStyle = themeStyle === 'neon' ? { borderColor: primaryColor, boxShadow: `0 0 20px ${primaryColor}40, inset 0 0 10px ${primaryColor}20` } : {};
  const neonText = themeStyle === 'neon' ? { textShadow: `0 0 10px ${primaryColor}` } : {};
  const neonTextColored = themeStyle === 'neon' ? { color: primaryColor, textShadow: `0 0 10px ${primaryColor}` } : { color: primaryColor };

  const Icon = getWidgetIcon(config.widgetIcon, MessageSquare);

  if (type === 'latest') {
    return (
      <div className="w-screen h-screen overflow-hidden flex items-center justify-center pb-24">
        <AnimatePresence>
          {currentAlert && (
            <motion.div
              {...animProps}
              className={`max-w-2xl w-full p-8 flex flex-col items-center text-center gap-6 ${containerStyle}`}
              style={{ ...fontStyle, ...neonStyle, transform: `scale(${config.scale || 1})` }}
            >
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 1, bounce: 0.5 }}
                className="w-24 h-24 rounded-full border-4 flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(0,0,0,0.3)]" 
                style={{ borderColor: primaryColor, backgroundColor: `${primaryColor}20`, color: primaryColor }}
              >
                <Icon className="w-12 h-12" />
              </motion.div>
              
              <div className="flex flex-col items-center w-full">
                <div className={`text-sm font-bold uppercase tracking-widest mb-2 ${isDarkText ? 'opacity-70' : 'text-gray-400'}`}>
                  Новый донат!
                </div>
                
                <div className="flex flex-col items-center gap-2 mb-4">
                  <span className={`font-black text-4xl truncate ${isDarkText ? '' : 'text-white'}`} style={neonText}>
                    {currentAlert.sender}
                  </span>
                  {config.showAmount !== false && (
                    <span className="font-mono font-black text-5xl" style={neonTextColored}>
                      {currentAlert.amount.toLocaleString()} ₸
                    </span>
                  )}
                </div>

                {currentAlert.message && (
                  <div className={`mt-4 p-6 rounded-2xl w-full text-xl leading-relaxed break-words ${themeStyle === 'brutalist' ? 'border-4 border-black bg-white text-black font-bold' : 'bg-black/20 border border-white/10'} ${isDarkText && themeStyle !== 'brutalist' ? 'text-black' : 'text-white'}`}>
                    {currentAlert.message}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (type === 'media') {
    const videoUrl = currentAlert ? extractYouTubeUrl(currentAlert.message) : null;
    
    return (
      <div className="w-screen h-screen overflow-hidden flex items-center justify-center">
        <AnimatePresence>
          {currentAlert && videoUrl && (
            <motion.div
              {...animProps}
              className={`max-w-2xl w-full p-6 ${containerStyle}`}
              style={{ ...fontStyle, ...neonStyle, transform: `scale(${config.scale || 1})` }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 shadow-lg" style={{ borderColor: primaryColor, backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                  <Music className="w-6 h-6" />
                </div>
                <div>
                  <div className={`font-bold text-lg ${isDarkText ? '' : 'text-white'}`}>
                    {currentAlert.sender} <span className="font-mono ml-2" style={neonTextColored}>{currentAlert.amount.toLocaleString()} ₸</span>
                  </div>
                  <div className={`text-sm mt-0.5 ${isDarkText ? 'opacity-80' : 'text-gray-300'}`}>Заказал медиа!</div>
                </div>
              </div>
              
              <div className={`relative aspect-video bg-black overflow-hidden ${themeStyle === 'brutalist' ? 'border-4 border-black' : 'rounded-xl border border-white/10'}`}>
                <ReactPlayer 
                  url={videoUrl} 
                  playing={isPlaying} 
                  controls={false}
                  width="100%"
                  height="100%"
                  onEnded={handleMediaEnd}
                  config={{
                    youtube: {
                      playerVars: { autoplay: 1 }
                    }
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (type === 'requisites') {
    return (
      <div className="w-screen h-screen overflow-hidden flex items-center justify-center">
        <motion.div 
          {...animProps}
          className={`w-full max-w-sm p-8 flex flex-col items-center gap-6 ${containerStyle}`}
          style={{ ...fontStyle, ...neonStyle, transform: `scale(${config.scale || 1})` }}
        >
          <h3 className={`font-bold text-xl tracking-wider text-center flex items-center justify-center gap-2 ${isDarkText ? '' : 'text-white'}`} style={neonText}>
            <Heart className="w-6 h-6" style={{ color: primaryColor }} />
            {config.title || 'Поддержать стримера'}
          </h3>
          
          <div className="flex flex-col items-center justify-center w-full text-center">
            <div className={`text-xs font-bold uppercase tracking-widest mb-2 opacity-70 ${isDarkText ? '' : 'text-white'}`}>Kaspi.kz</div>
            <div className="font-mono font-bold text-3xl tracking-widest mb-2" style={neonTextColored}>
              {config.phone || '+7 777 123 4567'}
            </div>
            <div className={`font-medium tracking-widest uppercase text-sm opacity-90 ${isDarkText ? '' : 'text-white'}`}>
              {config.name || 'Almas B.'}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (type === 'goals') {
    const goals = config.goals || [];
    
    return (
      <div className="w-screen h-screen overflow-hidden flex items-center justify-center">
        <motion.div 
          {...animProps}
          className={`w-full max-w-sm p-6 ${containerStyle}`}
          style={{ ...fontStyle, ...neonStyle, transform: `scale(${config.scale || 1})` }}
        >
          <h3 className={`font-bold text-base mb-6 uppercase tracking-widest flex items-center gap-2 justify-center ${isDarkText ? '' : 'text-white'}`} style={neonText}>
            <Target className="w-5 h-5" style={{ color: primaryColor }} /> Карта целей
          </h3>
          
          <div className="space-y-5 relative before:absolute before:inset-0 before:ml-[13px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-current before:via-current/30 before:to-current/10">
            {goals.map((g: any, i: number) => {
              const isDone = g.current >= g.target;
              const percent = Math.min(100, Math.round((g.current / g.target) * 100)) || 0;
              return (
                <div key={g.id || i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className={`flex items-center justify-center w-7 h-7 rounded-full border-4 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md z-10 ${isDone ? 'text-white' : g.current > 0 ? 'bg-white' : 'bg-transparent'}`} style={{ borderColor: isDone ? primaryColor : 'currentColor', backgroundColor: isDone ? primaryColor : undefined }}>
                    {isDone && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                  
                  <div className={`w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] p-4 shadow-md ${themeStyle === 'brutalist' ? 'border-2 border-black' : 'rounded-xl border border-white/10'} ${isDarkText ? 'bg-white/80' : 'bg-black/40 backdrop-blur-md'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`font-bold text-sm ${isDone ? 'opacity-50 line-through' : ''}`}>{g.title}</span>
                      <span className="text-xs font-mono font-bold" style={{ color: isDone ? 'inherit' : primaryColor }}>{percent}%</span>
                    </div>
                    <div className={`h-2 overflow-hidden ${themeStyle === 'brutalist' ? 'border border-black' : 'rounded-full'} ${isDarkText ? 'bg-black/10' : 'bg-white/10'}`}>
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
      </div>
    );
  }

  if (type === 'top-donators') {
    const topDonators = useMemo(() => {
      const totals: Record<string, number> = {};
      donations.forEach(d => {
        totals[d.sender] = (totals[d.sender] || 0) + d.amount;
      });
      return Object.entries(totals)
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, config.count || 3);
    }, [donations, config.count]);

    const colors = ['#FFD700', '#C0C0C0', '#CD7F32'];

    return (
      <div className="w-screen h-screen overflow-hidden flex items-center justify-center">
        <motion.div 
          {...animProps}
          className={`w-full max-w-sm p-6 ${containerStyle}`}
          style={{ ...fontStyle, ...neonStyle, transform: `scale(${config.scale || 1})` }}
        >
          <h3 className={`text-center font-bold text-base mb-5 uppercase tracking-widest flex items-center justify-center gap-2 ${isDarkText ? '' : 'text-white'}`} style={neonText}>
            <Trophy className="w-5 h-5" style={{ color: primaryColor }} />
            Топ Донатеров {config.period === 'month' ? '(Месяц)' : config.period === 'stream' ? '(Стрим)' : ''}
          </h3>
          <div className="space-y-3">
            {topDonators.map((d, i) => (
              <div key={i} className={`flex items-center justify-between p-3 shadow-sm ${themeStyle === 'brutalist' ? 'border-2 border-black' : 'rounded-xl border border-white/10'} ${isDarkText ? 'bg-white/80' : 'bg-black/40 backdrop-blur-md'}`}>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-inner" style={{ backgroundColor: `${colors[i] || '#8E9299'}20`, color: colors[i] || (isDarkText ? '#555' : '#8E9299'), border: `2px solid ${colors[i] || '#8E9299'}60` }}>
                    {i + 1}
                  </div>
                  <span className={`font-bold text-base ${isDarkText ? '' : 'text-gray-100'}`}>{d.name}</span>
                </div>
                <span className="font-mono font-bold text-base" style={{ color: i < 3 ? colors[i] : 'inherit' }}>{d.amount.toLocaleString()} ₸</span>
              </div>
            ))}
            {topDonators.length === 0 && (
              <div className="text-center text-gray-400 text-sm py-4">Пока нет донатов</div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Fallback for other widgets
  return (
    <div className="w-screen h-screen flex items-center justify-center text-white font-mono opacity-50">
      Widget: {type} / {id}
    </div>
  );
}
