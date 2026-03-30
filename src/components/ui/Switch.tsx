import { motion } from 'motion/react';

export function Switch({ checked, onChange }: { checked: boolean, onChange: (c: boolean) => void }) {
  return (
    <div 
      className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${checked ? 'bg-[#F14635]' : 'bg-[#222228]'}`}
      onClick={() => onChange(!checked)}
    >
      <motion.div 
        className="w-4 h-4 bg-white rounded-full shadow-sm"
        animate={{ x: checked ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </div>
  );
}
