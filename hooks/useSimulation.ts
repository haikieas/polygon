import { useState, useEffect, useCallback, useRef } from 'react';
import { AgentData, AgentType, CellData, SimulationStats } from '../types';
import { v4 as uuidv4 } from 'uuid'; // We'll implement a simple ID generator to avoid deps if needed, but UUID is standard. 
// Actually, to avoid extra deps for the user, I'll write a simple random ID helper.

const generateId = () => Math.random().toString(36).substr(2, 9);

const ROWS = 12;
const COLS = 12;
const EMPTY_RATIO = 0.25;

export const useSimulation = () => {
  const [cells, setCells] = useState<CellData[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bias, setBias] = useState(0.33); // 33% similarity needed
  const [tickRate, setTickRate] = useState(800);
  const [stats, setStats] = useState<SimulationStats>({ segregation: 0, unhappyCount: 0, totalAgents: 0 });

  // Helper: Get random organic offset
  const getRandomOffset = () => (Math.random() - 0.5) * 8; // +/- 4px

  // Initialize Board
  const initializeBoard = useCallback(() => {
    const newCells: CellData[] = [];
    const totalCells = ROWS * COLS;
    const emptyCount = Math.floor(totalCells * EMPTY_RATIO);
    const agentCount = totalCells - emptyCount;
    
    // Create pool of agents (50/50 split)
    const agents: AgentData[] = [];
    for (let i = 0; i < agentCount; i++) {
      agents.push({
        id: generateId(),
        type: i % 2 === 0 ? 'A' : 'B',
        xOffset: getRandomOffset(),
        yOffset: getRandomOffset(),
      });
    }

    // Shuffle agents
    for (let i = agents.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [agents[i], agents[j]] = [agents[j], agents[i]];
    }

    // Fill cells
    let agentIndex = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        // Randomly leave some empty based on remaining distribution, 
        // but it's easier to just fill linear after shuffle and leave rest empty
        const cellId = `${r}-${c}`;
        const agent = agentIndex < agents.length ? agents[agentIndex++] : null;
        newCells.push({
          id: cellId,
          row: r,
          col: c,
          agent
        });
      }
    }
    
    // Shuffle cells themselves to scatter the empty spots randomly
    // Actually, preserving row/col structure is key, so we just assigned agents to first N cells then shuffle? 
    // No, better to assign agents randomly to the grid coordinates.
    
    // Better init: Create all empty cells, then pick random cells to place agents.
    const emptyCells: CellData[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        emptyCells.push({ id: `${r}-${c}`, row: r, col: c, agent: null });
      }
    }
    
    // Place agents
    agents.forEach(agent => {
        const idx = Math.floor(Math.random() * emptyCells.length);
        emptyCells[idx].agent = agent;
        // Move the filled cell to a "filled" list? No, just keep the array.
        // But we need to maintain the grid order for rendering usually? 
        // Actually, for stats calculation, coordinate access is easier if linear index = row * cols + col.
    });

    // Sort by grid position so rendering is stable 
    // (though visual position is determined by row/col in CSS Grid, array order doesn't strictly matter if keyed)
    emptyCells.sort((a, b) => (a.row * COLS + a.col) - (b.row * COLS + b.col));

    setCells(emptyCells);
  }, []);

  // Run init on mount
  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  // Logic: Check happiness
  const isHappy = useCallback((cell: CellData, currentCells: CellData[]) => {
    if (!cell.agent) return true; // Empty cells don't have feelings

    const neighbors = [];
    // Moore Neighborhood (8 surrounding)
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = cell.row + dr;
        const nc = cell.col + dc;
        
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
          const neighbor = currentCells.find(c => c.row === nr && c.col === nc);
          if (neighbor && neighbor.agent) {
            neighbors.push(neighbor.agent);
          }
        }
      }
    }

    if (neighbors.length === 0) return true; // Isolated agents are happy? Or unhappy? Standard is happy/neutral.

    const sameType = neighbors.filter(n => n.type === cell.agent?.type).length;
    const similarity = sameType / neighbors.length;

    return similarity >= bias;
  }, [bias]);

  // Update Stats
  useEffect(() => {
    if (cells.length === 0) return;

    let totalSimilarity = 0;
    let countedAgents = 0;
    let unhappy = 0;

    cells.forEach(cell => {
      if (cell.agent) {
        // Calculate segregation (avg % of same neighbors)
        const neighbors = [];
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = cell.row + dr;
            const nc = cell.col + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
              const neighbor = cells.find(c => c.row === nr && c.col === nc);
              if (neighbor?.agent) neighbors.push(neighbor.agent);
            }
          }
        }

        if (neighbors.length > 0) {
          const same = neighbors.filter(n => n.type === cell.agent?.type).length;
          totalSimilarity += (same / neighbors.length);
          countedAgents++;
        }

        if (!isHappy(cell, cells)) {
          unhappy++;
        }
      }
    });

    setStats({
      segregation: countedAgents > 0 ? (totalSimilarity / countedAgents) * 100 : 0,
      unhappyCount: unhappy,
      totalAgents: cells.filter(c => c.agent).length
    });
  }, [cells, bias, isHappy]);

  // Move Logic
  const moveUnhappyAgents = useCallback(() => {
    setCells(prevCells => {
      const nextCells = [...prevCells.map(c => ({...c}))]; // Deep-ish copy
      const unhappyCells = nextCells.filter(c => c.agent && !isHappy(c, nextCells));
      
      if (unhappyCells.length === 0) {
        setIsPlaying(false); // Stop if everyone is happy
        return prevCells;
      }

      // Limit movements per tick for visual clarity? 
      // Schelling usually moves unhappy agents to the *nearest* empty spot or *random* empty spot.
      // Random is "The Parable of the Polygons" way.
      // Let's move up to 5% of the population per tick to prevent chaos, or just all of them?
      // Moving all simultaneously can cause swapping loops.
      // Let's shuffle unhappy agents and move them one by one in the same state update.
      
      const emptyIndices = nextCells
        .map((c, idx) => c.agent === null ? idx : -1)
        .filter(idx => idx !== -1);
      
      // Shuffle empty indices to ensure random destination
      for (let i = emptyIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [emptyIndices[i], emptyIndices[j]] = [emptyIndices[j], emptyIndices[i]];
      }

      // Process a batch of unhappy agents
      // If we move too many, we run out of empty spots in this calculated frame if we don't track the newly emptied ones.
      // Simplest robust way: Iterate unhappy, move to first available random empty, swap.
      
      // Shuffle unhappy cells to avoid bias in processing order
      for (let i = unhappyCells.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [unhappyCells[i], unhappyCells[j]] = [unhappyCells[j], unhappyCells[i]];
      }

      let moves = 0;
      const maxMoves = Math.max(1, Math.floor(unhappyCells.length * 0.5)); // Move 50% of unhappy agents per tick

      for (const cell of unhappyCells) {
        if (moves >= maxMoves) break;
        if (emptyIndices.length === 0) break; // No space

        const targetIndex = emptyIndices.pop(); // Take a random empty spot
        if (targetIndex === undefined) break;

        const targetCell = nextCells[targetIndex];
        
        // Swap
        targetCell.agent = {
            ...cell.agent!,
            xOffset: getRandomOffset(), // New organic offset
            yOffset: getRandomOffset()
        };
        cell.agent = null;
        
        // The old cell is now empty, add it to pool? 
        // For simplicity in this batch, we won't reuse the just-emptied spot immediately to prevent ping-pong.
        // But we could push `nextCells.indexOf(cell)` to emptyIndices.
        
        moves++;
      }

      return nextCells;
    });
  }, [isHappy]);

  // Tick Loop
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(moveUnhappyAgents, tickRate);
    }
    return () => clearInterval(interval);
  }, [isPlaying, tickRate, moveUnhappyAgents]);


  // Manual Move (Drag & Drop)
  const moveAgent = (fromId: string, toRow: number, toCol: number) => {
    setCells(prev => {
        const newCells = prev.map(c => ({...c}));
        const fromIndex = newCells.findIndex(c => c.agent?.id === fromId);
        const toIndex = newCells.findIndex(c => c.row === toRow && c.col === toCol);

        if (fromIndex === -1 || toIndex === -1) return prev;
        if (newCells[toIndex].agent !== null) return prev; // Occupied

        // Move
        newCells[toIndex].agent = {
            ...newCells[fromIndex].agent!,
            xOffset: getRandomOffset(),
            yOffset: getRandomOffset()
        };
        newCells[fromIndex].agent = null;
        
        return newCells;
    });
  };

  return {
    cells,
    rows: ROWS,
    cols: COLS,
    isPlaying,
    setIsPlaying,
    initializeBoard,
    bias,
    setBias,
    stats,
    isHappy,
    moveAgent
  };
};