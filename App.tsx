import React from 'react';
import { Board } from './components/Board';
import { ControlPanel } from './components/ControlPanel';
import { StatsPanel } from './components/StatsPanel';
import { useSimulation } from './hooks/useSimulation';
import { AGENT_THEMES } from './theme';

function App() {
  const { 
    cells, 
    rows, 
    cols, 
    isPlaying, 
    setIsPlaying, 
    initializeBoard, 
    bias, 
    setBias, 
    stats,
    isHappy,
    moveAgent
  } = useSimulation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#fbf8f3] text-stone-800">
      
      {/* Header */}
      <div className="mb-6 text-center max-w-lg">
        <h1 className="text-4xl font-black mb-2 tracking-tight text-stone-800">
            Polygons
        </h1>

      </div>

      <StatsPanel stats={stats} />

      <Board 
        cells={cells} 
        rows={rows} 
        cols={cols} 
        isHappy={isHappy} 
        theme={AGENT_THEMES.SHAPES} 
        onMoveAgent={moveAgent}
        allCells={cells}
      />

      <ControlPanel 
        isPlaying={isPlaying} 
        onPlayPause={() => setIsPlaying(!isPlaying)} 
        onReset={initializeBoard}
        bias={bias}
        setBias={setBias}
      />
      

    </div>
  );
}

export default App;