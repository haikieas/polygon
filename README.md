# Polygon: A Visual Exploration of Micro-Motives

This React-based application visualizes how individual bias, even when small, can lead to large-scale segregation in a society.

## 🚀 **Project Overview**

- **Interactive Simulation**:
    - Watch agents (polygons) move around a grid based on their happiness.
    - Agents become "unhappy" if too few of their neighbors are like them.
    - Experience the dynamics of segregation firsthand.

- **Dynamic Visualization**:
    - Built with **Framer Motion** for smooth, fluid animations.
    - Agents react visually (wiggles, color changes) to their state.
    - Glassmorphic UI design for a modern, clean look.

## 🛠️ **Tech Stack**

This project is built with modern web technologies for performance and developer experience:

- **Frontend Framework**:
    - [React 19](https://react.dev/) - The latest version of the library for web and native user interfaces.
    - [TypeScript](https://www.typescriptlang.org/) - For type-safe code and better developer tooling.
    - [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling for fast builds and HMR.

- **Styling & Animation**:
    - [TailwindCSS](https://tailwindcss.com/) - A utility-first CSS framework for rapid UI development.
    - [Framer Motion](https://www.framer.com/motion/) - For complex, production-ready animations (drag-and-drop, layout transitions).
    - [Lucide React](https://lucide.dev/) - Beautiful & consistent icons.

- **Logic & State**:
    - Custom React Hooks (`useSimulation`) to manage the Schelling model logic.
    - `uuid` for unique agent identification.

## ✨ **Key Features**

- **Live Control Panel**:
    - **Play/Pause**: Stop and start the simulation at any time.
    - **Reset**: clear the board and start fresh.
    - **Bias Adjustment**: dynamically change the intolerance level of the agents and see how it affects the outcome.

- **Interactive Board**:
    - **Drag & Drop**: Manually move agents to see how the system reacts.
    - **Happiness Indicators**: Visual cues (e.g., shaking, red dots) show which agents are unhappy.

- **Real-time Stats**:
    - Track the overall "Happiness" of society.
    - Monitor the percentage of segregated vs. integrated agents in real-time.

## 📦 **Installation & Setup**

Follow these steps to get the project running locally:

1.  **Clone the Repository** (if applicable)
    ```bash
    git clone <repository-url>
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run the Development Server**
    ```bash
    npm run dev
    ```

4.  **Open in Browser**
    - Navigate to the local URL provided by Vite (usually `http://localhost:5173`).

## 📂 **Project Structure**

- **`App.tsx`**: The main entry point, orchestrating the Board, Stats, and Control panels.
- **`components/`**:
    - **`Board.tsx`**: The grid container handling the layout of agents.
    - **`Agent.tsx`**: The individual polygon component with drag and animation logic.
    - **`ControlPanel.tsx`**: UI for interactive settings (Play, Pause, Bias).
    - **`StatsPanel.tsx`**: Displays current simulation metrics.
- **`hooks/`**:
    - **`useSimulation.ts`**: Contains the core algorithmic logic for the Schelling Model (moving agents, calculating happiness).
- **`theme.tsx`**: Centralized design tokens and shape definitions.
- **`types.ts`**: TypeScript definitions for Cell, Agent, and Simulation states.

## 🧠 **The Science Behind It**

Based on **Thomas Schelling's 1971 paper**, "Dynamic Models of Segregation".
- **The Concept**: Even if individuals have a "tolerance" (e.g., "I want at least 30% of my neighbors to be like me"), this slight preference can lead to a completely segregated society.
- **The Goal**: To show that systemic segregation doesn't necessarily require individual hatred, but can emerge from small, individual preferences.
