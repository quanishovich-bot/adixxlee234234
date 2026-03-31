import { useState } from 'react';
import { Card } from './ui/Card';
import { Switch } from './ui/Switch';
import { Settings as SettingsIcon, Filter, Moon, Sun, DollarSign, Smartphone, Copy, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Settings() {
  const [ignoreEmpty, setIgnoreEmpty] = useState(true);
  const [ignoreSystem, setIgnoreSystem] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [copied, setCopied] = useState(false);

  const webhookUrl = `${window.location.origin}/api/webhooks/kaspi`;

  const handleCopy = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Общие настройки</h1>
        <p className="text-[#8E9299] mt-1">Базовые параметры приложения, пороги сумм и фильтры.</p>
      </div>

      {/* Phone Integration */}
      <Card className="border-[#F14635]/30 shadow-[0_0_30px_rgba(241,70,53,0.05)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#F14635] to-[#FF7E67] flex items-center justify-center shadow-[0_0_15px_rgba(241,70,53,0.3)]">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Интеграция с телефоном (MacroDroid)</h2>
            <p className="text-sm text-[#8E9299]">Настройте пересылку уведомлений Kaspi с вашего Android устройства.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-[#0A0A0C] border border-[#222228] rounded-xl p-4">
              <label className="text-sm text-[#8E9299] font-medium block mb-2">Ваш уникальный Webhook URL</label>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={webhookUrl} 
                  className="bg-transparent border-none outline-none flex-1 text-sm font-mono text-[#F14635]"
                />
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-2 bg-[#222228] hover:bg-[#2A2A32] text-white px-3 py-1.5 rounded-lg transition-colors text-xs font-medium"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-[#00E65B]" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Скопировано' : 'Копировать'}
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-300 space-y-2">
              <p><strong>Формат POST запроса (JSON):</strong></p>
              <pre className="bg-[#0A0A0C] border border-[#222228] p-3 rounded-lg font-mono text-xs text-[#00E65B]">
{`{
  "amount": 1000,
  "sender": "Имя Отправителя",
  "message": "Текст сообщения"
}`}
              </pre>
            </div>
          </div>

          <div className="space-y-4 text-sm text-gray-300">
            <h3 className="font-semibold text-white">Инструкция по настройке:</h3>
            <ol className="list-decimal list-inside space-y-2 text-[#8E9299]">
              <li>Установите приложение <strong>MacroDroid</strong> из Google Play.</li>
              <li>Создайте новый макрос.</li>
              <li><strong>Триггер:</strong> Уведомление от приложения Kaspi.kz (содержит текст "пополнение" или "перевод").</li>
              <li><strong>Действие:</strong> HTTP Запрос (POST).</li>
              <li>Вставьте ваш Webhook URL в поле URL.</li>
              <li>Выберите тип контента <code>application/json</code>.</li>
              <li>В теле запроса используйте магические переменные MacroDroid для извлечения суммы, имени и текста из уведомления.</li>
              <li>Сохраните макрос и включите его.</li>
            </ol>
          </div>
        </div>
      </Card>

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
