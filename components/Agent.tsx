import React from 'react';
import { motion, PanInfo } from 'framer-motion';
import { AgentData, ThemeConfig } from '../types';

interface AgentProps {
  agent: AgentData;
  happy: boolean;
  theme: ThemeConfig;
  onDragEnd: (agentId: string, info: PanInfo) => void;
  cellSize: number;
}

export const Agent: React.FC<AgentProps> = ({ agent, happy, theme, onDragEnd, cellSize }) => {
  const ShapeComponent = agent.type === 'A' ? theme.shapes.A : theme.shapes.B;
  const color = agent.type === 'A' ? theme.colors.A : theme.colors.B;

  return (
    <motion.div
      layoutId={agent.id}
      className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1, 
        x: agent.xOffset, 
        y: agent.yOffset,
        rotate: happy ? 0 : [0, -3, 3, 0],
        color: color
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 28,
        mass: 0.8,
        rotate: { 
          repeat: happy ? 0 : Infinity, 
          duration: 2, 
          repeatType: "mirror", 
          ease: "easeInOut" 
        }
      }}
      drag
      dragSnapToOrigin
      dragElastic={0.2}
      dragMomentum={false}
      onDragEnd={(e, info) => onDragEnd(agent.id, info)}
      whileHover={{ scale: 1.1, zIndex: 50 }}
      whileDrag={{ scale: 1.2, zIndex: 100 }}
    >
      <div style={{ width: cellSize * 0.7, height: cellSize * 0.7 }}>
        <ShapeComponent happy={happy} />
      </div>
      
      {!happy && (
         <motion.div 
            className="absolute top-0 right-0"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
         >
            <div className="w-2 h-2 bg-red-400/60 rounded-full" />
         </motion.div>
      )}
    </motion.div>
  );
};