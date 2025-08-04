import { useState, type ReactNode } from 'react';
import { NodeModalContext } from '@/context/workflow/node-modal-context';

/**
 * 节点弹窗上下文提供器
 */
export const NodeModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}: { children: ReactNode }) => {
  const [nodeId, setNodeId] = useState<string | undefined>();
  return (
    <NodeModalContext value={{ open: !!nodeId, nodeId, setNodeId }}>
      {children}
    </NodeModalContext>
  );
};
