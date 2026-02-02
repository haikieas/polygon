import React, { useRef } from 'react';
import { Agent } from './Agent';
import { CellData, AgentData, ThemeConfig } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface BoardProps {
  cells: CellData[];
  rows: number;
  cols: number;
  isHappy: (cell: CellData, cells: CellData[]) => boolean;
  theme: ThemeConfig;
  onMoveAgent: (agentId: string, row: number, col: number) => void;
  allCells: CellData[]; // Pass full state for happiness check
}

export const Board: React.FC<BoardProps> = ({ 
  cells, 
  rows, 
  cols, 
  isHappy, 
  theme, 
  onMoveAgent,
  allCells 
}) => {
  const boardRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (agentId: string, info: any) => {
    if (!boardRef.current) return;
    
    // Simple heuristic: Calculate drop position based on pointer coordinates relative to board
    // This is rough estimation but works for "visual" drag
    const boardRect = boardRef.current.getBoundingClientRect();
    const cellSize = boardRect.width / cols;
    
    // Point relative to board
    const x = info.point.x - boardRect.left;
    const y = info.point.y - boardRect.top;

    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (row >= 0 && row < rows && col >= 0 && col < cols) {
        onMoveAgent(agentId, row, col);
    }
  };

  // We need to calculate cell size for the Agent to size itself
  // Assuming responsive grid, we can just pass a rough scalar or let CSS handle it
  // But for drag calc we used `boardRect`. 
  // Let's pass a `cellSize` prop down? Or just rely on CSS. 
  // Framer motion layout works best if the DOM structure is stable.

  return (
    <div 
        ref={boardRef}
        className="grid gap-1 p-4 bg-white/50 rounded-xl shadow-inner border border-stone-200"
        style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            maxWidth: '600px',
            width: '100%',
            aspectRatio: '1/1'
        }}
    >
      {cells.map((cell) => {
        const happy = isHappy(cell, allCells);
        
        return (
          <div 
            key={cell.id} 
            className="relative w-full h-full bg-black/5 rounded-lg overflow-visible"
            // Ensure z-index is handled by motion component
          >
             {/* Render Agent if present */}
             <AnimatePresence mode='popLayout'>
                 {cell.agent && (
                     <Agent 
                        key={cell.agent.id}
                        agent={cell.agent}
                        happy={happy}
                        theme={theme}
                        onDragEnd={handleDragEnd}
                        cellSize={50} // Approximate reference size, visual is CSS based
                     />
                 )}
             </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};