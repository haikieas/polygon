export type AgentType = 'A' | 'B';

export interface AgentData {
  id: string;
  type: AgentType;
  xOffset: number; // Random organic offset X
  yOffset: number; // Random organic offset Y
}

export interface CellData {
  id: string; // Cell ID (e.g., "cell-0-1")
  row: number;
  col: number;
  agent: AgentData | null;
}

export interface SimulationStats {
  segregation: number;
  unhappyCount: number;
  totalAgents: number;
}

export interface ThemeConfig {
  name: string;
  colors: {
    A: string;
    B: string;
    background: string;
  };
  shapes: {
    A: React.FC<{ happy: boolean }>;
    B: React.FC<{ happy: boolean }>;
  };
}