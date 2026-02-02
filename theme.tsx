import React from 'react';
import { ThemeConfig } from './types';
import { motion } from 'framer-motion';

// --- Reusable Face Components ---

const Eyes = ({ happy }: { happy: boolean }) => (
  <g fill="#333">
    <circle cx="35" cy="40" r={happy ? 4 : 3} />
    <circle cx="65" cy="40" r={happy ? 4 : 3} />
  </g>
);

const Mouth = ({ happy }: { happy: boolean }) => (
  <motion.path
    d={happy ? "M 30 65 Q 50 80 70 65" : "M 35 70 L 65 70"}
    stroke="#333"
    strokeWidth="4"
    strokeLinecap="round"
    fill="transparent"
    animate={{ d: happy ? "M 30 65 Q 50 80 70 65" : "M 35 70 L 65 70" }}
  />
);

const SadBrows = () => (
    <g stroke="#333" strokeWidth="3" strokeLinecap="round">
         <path d="M 30 30 L 40 35" />
         <path d="M 70 30 L 60 35" />
    </g>
)

// --- Shape Components ---

const TriangleShape: React.FC<{ happy: boolean }> = ({ happy }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
    <path d="M 50 15 L 85 85 L 15 85 Z" fill="currentColor" className="text-blue-400" />
    <Eyes happy={happy} />
    <Mouth happy={happy} />
    {!happy && <SadBrows />}
  </svg>
);

const SquareShape: React.FC<{ happy: boolean }> = ({ happy }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
    <rect x="20" y="20" width="60" height="60" rx="10" fill="currentColor" className="text-yellow-400" />
    <Eyes happy={happy} />
    <Mouth happy={happy} />
    {!happy && <SadBrows />}
  </svg>
);

// --- Theme Configurations ---

export const AGENT_THEMES: Record<string, ThemeConfig> = {
  SHAPES: {
    name: 'Shapes',
    colors: {
      A: '#60a5fa', // blue-400
      B: '#fbbf24', // amber-400
      background: '#fbf8f3',
    },
    shapes: {
      A: TriangleShape,
      B: SquareShape,
    },
  },
  // Easy to extend with 'TOYS', 'ANIMALS', etc.
};
