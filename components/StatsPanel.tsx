import React from 'react';
import { SimulationStats } from '../types';
import { motion } from 'framer-motion';

export const StatsPanel: React.FC<{ stats: SimulationStats }> = ({ stats }) => {
  return (
    <div className="flex gap-6 text-sm font-medium text-stone-600 mb-4 bg-white px-6 py-3 rounded-full shadow-sm border border-stone-100">
      <div className="flex flex-col items-center">
        <span className="text-xs uppercase tracking-wider text-stone-400">Segregation</span>
        <motion.span 
          key={stats.segregation}
          initial={{ scale: 1.2, color: '#fbbf24' }}
          animate={{ scale: 1, color: '#4b5563' }}
          className="text-lg font-bold"
        >
          {Math.round(stats.segregation)}%
        </motion.span>
      </div>
      <div className="w-px bg-stone-200" />
      <div className="flex flex-col items-center">
        <span className="text-xs uppercase tracking-wider text-stone-400">Unhappy</span>
        <motion.span 
           key={stats.unhappyCount}
           initial={{ scale: 1.2, color: '#ef4444' }}
           animate={{ scale: 1, color: '#4b5563' }}
           className="text-lg font-bold"
        >
          {stats.unhappyCount}
        </motion.span>
      </div>
    </div>
  );
};