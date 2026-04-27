import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node, Edge, Background, Controls, MiniMap,
  useNodesState, useEdgesState, addEdge, Connection,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Box } from '@mui/material';

interface SkillNodeData {
  _id: string;
  name: string;
  status: 'to_learn' | 'in_progress' | 'verified';
  category: string;
  positionX: number;
  positionY: number;
}

interface Props {
  skills: SkillNodeData[];
  onNodeClick?: (skill: SkillNodeData) => void;
}

const STATUS_STYLES: Record<string, { bg: string; border: string; color: string; glow: string }> = {
  to_learn: { bg: 'rgba(74,96,128,0.3)', border: '#4a6080', color: '#8aa3c8', glow: 'rgba(74,96,128,0.3)' },
  in_progress: { bg: 'rgba(255,179,0,0.15)', border: '#ffb300', color: '#ffb300', glow: 'rgba(255,179,0,0.4)' },
  verified: { bg: 'rgba(0,255,136,0.1)', border: '#00ff88', color: '#00ff88', glow: 'rgba(0,255,136,0.4)' },
};

const buildNodes = (skills: SkillNodeData[]): Node[] =>
  skills.map((skill, i) => {
    const style = STATUS_STYLES[skill.status] || STATUS_STYLES.to_learn;
    return {
      id: skill._id,
      position: {
        x: skill.positionX || (i % 4) * 200 + 40,
        y: skill.positionY || Math.floor(i / 4) * 100 + 40,
      },
      data: { label: skill.name, skill },
      style: {
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: '10px',
        color: style.color,
        fontSize: '12px',
        fontWeight: 600,
        padding: '8px 14px',
        boxShadow: `0 0 12px ${style.glow}`,
        fontFamily: 'Inter, sans-serif',
        minWidth: 100,
        textAlign: 'center' as const,
      },
    };
  });

const SkillMap: React.FC<Props> = ({ skills, onNodeClick }) => {
  const initialNodes = useMemo(() => buildNodes(skills), [skills]);
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, style: { stroke: '#1a73e8', strokeWidth: 1.5 } }, eds)),
    [setEdges]
  );

  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    if (onNodeClick && node.data?.skill) onNodeClick(node.data.skill);
  };

  return (
    <Box sx={{
      width: '100%', height: 420,
      border: '1px solid rgba(26,115,232,0.2)',
      borderRadius: 2, overflow: 'hidden',
      background: 'rgba(5,11,24,0.8)',
      '& .react-flow__background': { opacity: 0.4 },
      '& .react-flow__controls': {
        background: 'rgba(10,22,40,0.9)',
        border: '1px solid rgba(26,115,232,0.2)',
        borderRadius: '8px',
        '& button': { background: 'transparent', borderColor: 'rgba(26,115,232,0.2)', color: '#8aa3c8', '&:hover': { background: 'rgba(26,115,232,0.1)' } },
      },
      '& .react-flow__minimap': {
        background: 'rgba(10,22,40,0.9)',
        border: '1px solid rgba(26,115,232,0.2)',
        borderRadius: '8px',
      },
    }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.3 }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="rgba(26,115,232,0.15)" />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const style = STATUS_STYLES[node.data?.skill?.status] || STATUS_STYLES.to_learn;
            return style.border;
          }}
          maskColor="rgba(5,11,24,0.7)"
        />
      </ReactFlow>
    </Box>
  );
};

export default SkillMap;
