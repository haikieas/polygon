import React from 'react';
import { Play, Pause, RotateCcw, Smile } from 'lucide-react';
import { motion } from 'framer-motion';

interface ControlPanelProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  bias: number;
  setBias: (val: number) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isPlaying,
  onPlayPause,
  onReset,
  bias,
  setBias
}) => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-[600px] mt-6 p-4 bg-white rounded-2xl shadow-sm border border-stone-100">
      
      {/* Bias Slider */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-stone-600">
            <span className="flex items-center gap-2 font-bold text-sm">
                <Smile size={16} />
                Bias Preference
            </span>
            <span className="bg-stone-100 px-2 py-1 rounded text-xs font-mono">
                Needs {Math.round(bias * 100)}% same neighbors
            </span>
        </div>
        <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05" 
            value={bias} 
            onChange={(e) => setBias(parseFloat(e.target.value))}
            className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
        />
        <div className="flex justify-between text-[10px] text-stone-400 uppercase tracking-widest font-bold">
            <span>Diverse</span>
            <span>Segregated</span>
        </div>
      </div>

      <div className="h-px bg-stone-100 w-full" />

      {/* Buttons */}
      <div className="flex items-center justify-center gap-4">
        <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={onPlayPause}
            className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-colors
                ${isPlaying ? 'bg-amber-400 hover:bg-amber-500' : 'bg-blue-500 hover:bg-blue-600'}
            `}
        >
            {isPlaying ? (
                <>
                    <Pause fill="currentColor" size={20} /> Pause
                </>
            ) : (
                <>
                    <Play fill="currentColor" size={20} /> Start
                </>
            )}
        </motion.button>

        <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05, backgroundColor: '#f3f4f6' }}
            onClick={onReset}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-stone-600 bg-white border-2 border-stone-200 hover:border-stone-300 transition-colors"
        >
            <RotateCcw size={20} /> Reset
        </motion.button>
      </div>
    </div>
  );
};