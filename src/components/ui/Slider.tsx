export function Slider({ value, onChange, max = 100 }: { value: number, onChange: (v: number) => void, max?: number }) {
  return (
    <input 
      type="range" 
      min="0" 
      max={max} 
      value={value} 
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-[#222228] rounded-lg appearance-none cursor-pointer accent-[#F14635]"
    />
  );
}
