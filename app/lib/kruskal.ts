export interface Node {
  id: number;
  x: number;
  y: number;
  label: string;
}

export interface Edge {
  id: string;
  source: number;
  target: number;
  weight: number;
  status: 'pending' | 'candidate' | 'accepted' | 'rejected';
}

export class UnionFind {
  parent: number[];
  rank: number[];

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.rank = Array(size).fill(0);
  }

  find(i: number): number {
    if (this.parent[i] !== i) {
      this.parent[i] = this.find(this.parent[i]);
    }
    return this.parent[i];
  }

  union(i: number, j: number): boolean {
    const rootI = this.find(i);
    const rootJ = this.find(j);

    if (rootI !== rootJ) {
      if (this.rank[rootI] < this.rank[rootJ]) {
        this.parent[rootI] = rootJ;
      } else if (this.rank[rootI] > this.rank[rootJ]) {
        this.parent[rootJ] = rootI;
      } else {
        this.parent[rootJ] = rootI;
        this.rank[rootI]++;
      }
      return true;
    }
    return false;
  }
}

export const generateNodes = (count: number, width: number, height: number): Node[] => {
  const nodes: Node[] = [];
  const padding = 50;
  
  for (let i = 0; i < count; i++) {
    let x: number, y: number, tooClose: boolean;
    do {
      x = Math.random() * (width - 2 * padding) + padding;
      y = Math.random() * (height - 2 * padding) + padding;
      tooClose = nodes.some(n => Math.hypot(n.x - x, n.y - y) < 60);
    } while (tooClose);

    nodes.push({
      id: i,
      x,
      y,
      label: String.fromCharCode(65 + i), // A, B, C...
    });
  }
  return nodes;
};

export const generateEdges = (nodes: Node[]): Edge[] => {
  const edges: Edge[] = [];
  // Generate a complete graph or near complete to ensure connectivity options
  // For visualization, maybe we don't want a complete graph if N is large, but for N=5-10 it's fine.
  // Let's generate all possible edges for now.
  
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
      // Add some randomness to weight so it's not perfectly geometric (simulating terrain cost)
      const weight = Math.floor(dist * (0.8 + Math.random() * 0.4)); 
      
      edges.push({
        id: `${i}-${j}`,
        source: i,
        target: j,
        weight,
        status: 'pending'
      });
    }
  }
  
  return edges.sort((a, b) => a.weight - b.weight);
};

export interface Step {
  edgeId: string;
  action: 'check';
  result: 'accepted' | 'rejected';
  ufState: number[]; // Snapshot of parent array if needed, or just visual feedback
}

export const getKruskalSteps = (numNodes: number, sortedEdges: Edge[]): Step[] => {
  const uf = new UnionFind(numNodes);
  const steps: Step[] = [];
  let edgesCount = 0;

  for (const edge of sortedEdges) {
    if (edgesCount >= numNodes - 1) break;

    // Step 1: Consider the edge
    // We can just record the result immediately for the animation
    const added = uf.union(edge.source, edge.target);
    
    steps.push({
      edgeId: edge.id,
      action: 'check',
      result: added ? 'accepted' : 'rejected',
      ufState: [...uf.parent]
    });

    if (added) {
      edgesCount++;
    }
  }
  
  return steps;
};
