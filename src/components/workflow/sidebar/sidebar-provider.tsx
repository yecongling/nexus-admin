import { type ReactNode, useState } from 'react';
import { SidebarContext } from '@/context/workflow/sidebar-context';

/**
 * 侧边栏上下文提供器
 */
export const SidebarProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
  const [nodeId, setNodeId] = useState<string | undefined>();
  return <SidebarContext value={{ visible: !!nodeId, nodeId, setNodeId }}>{children}</SidebarContext>;
};
