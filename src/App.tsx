import { useState } from 'react';
import { LayoutDashboard, ListOrdered, Palette, Volume2, Settings as SettingsIcon, MonitorPlay, Server, LayoutTemplate, Menu } from 'lucide-react';
import { motion } from 'motion/react';
import Dashboard from './components/Dashboard';
import Queue from './components/Queue';
import Appearance from './components/Appearance';
import AudioTTS from './components/AudioTTS';
import Settings from './components/Settings';
import Widgets from './components/Widgets';

const AnimatedLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
    <motion.path
      d="M12 2L2 7L12 12L22 7L12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0.2 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
    />
    <motion.path
      d="M2 17L12 22L22 17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0.2 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 2, delay: 0.6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
    />
    <motion.path
      d="M2 12L12 17L22 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0.2 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 2, delay: 0.3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
    />
  </svg>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Дашборд', icon: LayoutDashboard },
    { id: 'widgets', label: 'Виджеты', icon: LayoutTemplate },
    { id: 'queue', label: 'История', icon: ListOrdered },
    { id: 'appearance', label: 'Внешний вид', icon: Palette },
    { id: 'audio', label: 'Аудио', icon: Volume2 },
    { id: 'settings', label: 'Настройки', icon: SettingsIcon },
  ];

  return (
    <div className="flex h-screen bg-[#0A0A0C] text-white overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#141418] border-r border-[#222228] shrink-0 z-20">
        <div className="p-6 flex items-center gap-3 border-b border-[#222228]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F14635] to-[#FF7E67] flex items-center justify-center shadow-[0_0_20px_rgba(241,70,53,0.3)]">
            <AnimatedLogo />
          </div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">KaspiStream</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-[#F14635]/10 text-[#F14635] font-medium' 
                    : 'text-[#8E9299] hover:bg-[#1A1A20] hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'text-[#F14635] scale-110' : 'group-hover:scale-110'}`} />
                <span className="text-sm">{tab.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute left-0 w-1 h-8 bg-[#F14635] rounded-r-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#222228] bg-[#0A0A0C]/50">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#141418] border border-[#222228]">
              <div className="flex items-center gap-2">
                <MonitorPlay className="w-4 h-4 text-[#8E9299]" />
                <span className="text-xs text-gray-300">OBS Studio</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#00E65B] shadow-[0_0_8px_#00E65B]"></div>
            </div>
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#141418] border border-[#222228]">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-[#8E9299]" />
                <span className="text-xs text-gray-300">Сервер</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#00E65B] shadow-[0_0_8px_#00E65B]"></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-[#141418] border-b border-[#222228] flex items-center justify-between px-4 py-3 shrink-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F14635] to-[#FF7E67] flex items-center justify-center shadow-[0_0_15px_rgba(241,70,53,0.3)]">
              <AnimatedLogo />
            </div>
            <span className="font-bold text-lg tracking-tight">KaspiStream</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-[#8E9299] hover:text-white rounded-lg bg-[#222228]"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-[60px] left-0 right-0 bg-[#141418] border-b border-[#222228] z-30 shadow-2xl">
            <nav className="p-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-[#F14635]/10 text-[#F14635] font-medium' 
                        : 'text-[#8E9299] hover:bg-[#1A1A20] hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Main Scrollable Content */}
        <main className="flex-1 overflow-y-auto relative">
          <div className="max-w-6xl mx-auto p-4 md:p-8">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'widgets' && <Widgets />}
            {activeTab === 'queue' && <Queue />}
            {activeTab === 'appearance' && <Appearance />}
            {activeTab === 'audio' && <AudioTTS />}
            {activeTab === 'settings' && <Settings />}
          </div>
        </main>
        
        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden bg-[#141418] border-t border-[#222228] flex items-center justify-around p-2 pb-safe shrink-0 z-20">
          {tabs.slice(0, 5).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                  isActive ? 'text-[#F14635]' : 'text-[#8E9299] hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
