'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Node, Edge, generateNodes, generateEdges, getKruskalSteps, Step } from '../lib/kruskal';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;

export default function KruskalVisualizer() {
  const [nodeCount, setNodeCount] = useState(6);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'algorithm' | 'manual'>('algorithm');
  const [manualSelectedEdges, setManualSelectedEdges] = useState<Set<string>>(new Set());
  const [manualCost, setManualCost] = useState(0);
  const [algoCost, setAlgoCost] = useState(0);
  const [showComparison, setShowComparison] = useState(false);

  // Initialize graph
  const resetGraph = useCallback(() => {
    const newNodes = generateNodes(nodeCount, CANVAS_WIDTH, CANVAS_HEIGHT);
    const newEdges = generateEdges(newNodes);
    setNodes(newNodes);
    setEdges(newEdges);
    setSteps([]);
    setCurrentStepIndex(-1);
    setIsRunning(false);
    setManualSelectedEdges(new Set());
    setManualCost(0);
    setAlgoCost(0);
    setShowComparison(false);
  }, [nodeCount]);

  useEffect(() => {
    resetGraph();
  }, [resetGraph]);

  // Run Algorithm
  const runAlgorithm = () => {
    setMode('algorithm');
    const algoSteps = getKruskalSteps(nodes.length, edges); // edges are already sorted by weight in generateEdges
    setSteps(algoSteps);
    setCurrentStepIndex(-1);
    setIsRunning(true);
    setAlgoCost(0);
    setShowComparison(false);
  };

  // Animation Loop
  useEffect(() => {
    if (isRunning && currentStepIndex < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 800); // Delay between steps
      return () => clearTimeout(timer);
    } else if (isRunning && currentStepIndex >= steps.length - 1) {
      setIsRunning(false);
      // Calculate final algo cost
      const total = steps
        .filter(s => s.result === 'accepted')
        .reduce((acc, s) => {
          const edge = edges.find(e => e.id === s.edgeId);
          return acc + (edge ? edge.weight : 0);
        }, 0);
      setAlgoCost(total);
      if (manualSelectedEdges.size > 0) {
        setShowComparison(true);
      }
    }
  }, [isRunning, currentStepIndex, steps, edges, manualSelectedEdges]);

  // Handle Manual Click
  const handleEdgeClick = (edge: Edge) => {
    if (mode !== 'manual') return;
    
    const newSelection = new Set(manualSelectedEdges);
    if (newSelection.has(edge.id)) {
      newSelection.delete(edge.id);
      setManualCost(prev => prev - edge.weight);
    } else {
      newSelection.add(edge.id);
      setManualCost(prev => prev + edge.weight);
    }
    setManualSelectedEdges(newSelection);
  };

  // Helper to determine edge color/style
  const getEdgeStyle = (edge: Edge) => {
    if (mode === 'manual') {
      if (manualSelectedEdges.has(edge.id)) return { stroke: '#3b82f6', strokeWidth: 4, opacity: 1 }; // Blue
      return { stroke: '#e5e7eb', strokeWidth: 2, opacity: 0.5 }; // Gray
    }

    // Algorithm mode
    if (currentStepIndex === -1) return { stroke: '#e5e7eb', strokeWidth: 2, opacity: 0.5 };

    // Check status based on current step
    // We need to know the status of this edge up to the current step
    // Find if this edge was processed in steps[0...currentStepIndex]
    
    const stepIndex = steps.findIndex(s => s.edgeId === edge.id);
    
    if (stepIndex === -1 || stepIndex > currentStepIndex) {
      // Not yet processed
      return { stroke: '#e5e7eb', strokeWidth: 2, opacity: 0.5 };
    }

    const step = steps[stepIndex];
    
    if (stepIndex === currentStepIndex) {
      // Currently being processed (Candidate)
      return { stroke: '#eab308', strokeWidth: 4, opacity: 1 }; // Yellow
    }

    // Processed in past
    if (step.result === 'accepted') {
      return { stroke: '#22c55e', strokeWidth: 4, opacity: 1 }; // Green
    } else {
      return { stroke: '#ef4444', strokeWidth: 1, opacity: 0.2, strokeDasharray: '5,5' }; // Red/Faint
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto p-4">
      
      {/* Controls */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-500 uppercase">Comunidades</label>
            <input 
              type="range" 
              min="4" 
              max="15" 
              value={nodeCount} 
              onChange={(e) => setNodeCount(Number(e.target.value))}
              disabled={isRunning}
              className="w-32 accent-blue-600"
            />
            <span className="text-xs text-gray-400">{nodeCount} nós</span>
          </div>
          
          <button 
            onClick={resetGraph}
            disabled={isRunning}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Gerar Novo Cenário
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setMode('manual'); setSteps([]); setCurrentStepIndex(-1); setShowComparison(false); }}
            disabled={isRunning}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === 'manual' ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            Modo Manual (Tente você!)
          </button>
          <button 
            onClick={runAlgorithm}
            disabled={isRunning}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-md transition-transform active:scale-95 flex items-center gap-2"
          >
            {isRunning ? 'Rodando...' : 'Rodar Kruskal (Automático)'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Main Canvas */}
        <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden relative">
          <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur p-2 rounded-lg shadow text-sm">
            {mode === 'manual' ? (
              <p className="text-blue-700 font-medium">👉 Clique nas linhas para conectar as comunidades.</p>
            ) : (
              <p className="text-gray-600">
                {isRunning ? '🤖 O algoritmo está escolhendo as melhores conexões...' : 'Pronto para iniciar.'}
              </p>
            )}
          </div>

          <svg width="100%" height="100%" viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`} className="w-full h-auto bg-slate-50 touch-none select-none">
            {/* Edges */}
            {edges.map((edge) => {
              const style = getEdgeStyle(edge);
              const sourceNode = nodes[edge.source];
              const targetNode = nodes[edge.target];
              if (!sourceNode || !targetNode) return null;

              return (
                <g key={edge.id} onClick={() => handleEdgeClick(edge)} className={mode === 'manual' ? 'cursor-pointer hover:opacity-80' : ''}>
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={style.stroke}
                    strokeWidth={style.strokeWidth}
                    opacity={style.opacity}
                    strokeDasharray={style.strokeDasharray}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                  {/* Weight Label background */}
                  <circle 
                    cx={(sourceNode.x + targetNode.x) / 2} 
                    cy={(sourceNode.y + targetNode.y) / 2} 
                    r="12" 
                    fill="white" 
                    className="drop-shadow-sm"
                  />
                  {/* Weight Label */}
                  <text
                    x={(sourceNode.x + targetNode.x) / 2}
                    y={(sourceNode.y + targetNode.y) / 2}
                    dy="4"
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="bold"
                    fill="#64748b"
                  >
                    {edge.weight}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="18"
                  fill="white"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  className="drop-shadow-md"
                />
                <text
                  x={node.x}
                  y={node.y}
                  dy="5"
                  textAnchor="middle"
                  fontWeight="bold"
                  fill="#1e293b"
                  fontSize="14"
                >
                  {node.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Sidebar / Stats */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          
          {/* Stats Panel */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Resumo do Projeto</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Custo Manual</span>
                <span className="font-mono font-bold text-blue-600 text-lg">R$ {manualCost}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Custo Otimizado (Kruskal)</span>
                <span className={`font-mono font-bold text-lg ${algoCost > 0 ? 'text-green-600' : 'text-gray-300'}`}>
                  R$ {algoCost > 0 ? algoCost : '---'}
                </span>
              </div>

              {showComparison && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-xs text-green-800 font-semibold uppercase mb-1">Economia Gerada</p>
                  <p className="text-2xl font-bold text-green-700">
                    R$ {Math.max(0, manualCost - algoCost)}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {manualCost > algoCost 
                      ? "Dinheiro economizado para outras obras! 🎉" 
                      : manualCost === algoCost && manualCost > 0
                        ? "Parabéns! Você encontrou a solução ótima! 🌟"
                        : "O algoritmo encontrou uma solução melhor."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Edge List (Algorithm Steps) */}
          {mode === 'algorithm' && (
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
              <h3 className="font-bold text-gray-800 mb-2 text-sm uppercase tracking-wide">Processamento (Passo a Passo)</h3>
              <div className="overflow-y-auto flex-1 pr-2 space-y-2 max-h-[300px]">
                {edges.map((edge, idx) => {
                  // Determine status for list item
                  let statusIcon = '⚪';
                  let statusClass = 'text-gray-400';
                  let bgClass = 'bg-gray-50';

                  const stepIndex = steps.findIndex(s => s.edgeId === edge.id);
                  
                  if (stepIndex !== -1 && stepIndex <= currentStepIndex) {
                    const step = steps[stepIndex];
                    if (step.result === 'accepted') {
                      statusIcon = '✅';
                      statusClass = 'text-green-700 font-bold';
                      bgClass = 'bg-green-50 border-green-100';
                    } else {
                      statusIcon = '❌';
                      statusClass = 'text-red-400 line-through';
                      bgClass = 'bg-red-50 opacity-60';
                    }
                  } else if (stepIndex === currentStepIndex + 1) {
                     // Next up
                     bgClass = 'ring-2 ring-yellow-400 bg-yellow-50';
                  }

                  return (
                    <div key={edge.id} className={`flex justify-between items-center p-2 rounded border ${bgClass} text-sm transition-all`}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs bg-white px-1 rounded border">{nodes[edge.source].label}-{nodes[edge.target].label}</span>
                        <span className={statusClass}>R$ {edge.weight}</span>
                      </div>
                      <span>{statusIcon}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
