import { IsSidebarContext, SidebarContext } from '@/context/workflow/sidebar-context';
import { PlaygroundEntityContext, useClientContext, useRefresh } from '@flowgram.ai/free-layout-editor';
import { Drawer } from 'antd';
import { useContext, useEffect } from 'react';
import type { FlowNodeMeta } from '@/types/workflow/node';
import { SidebarNodeRenderer } from './sidebar-node-renderer';

/**
 * 侧边栏渲染器(渲染每个选中节点的配置面板)
 * @returns
 */
const SidebarRenderer: React.FC = () => {
  const { nodeId, setNodeId } = useContext(SidebarContext);
  const { selection, playground, document } = useClientContext();
  const refresh = useRefresh();

  const node = nodeId ? document.getNode(nodeId) : undefined;

  /**
   * 关闭侧边栏
   */
  const handleClose = () => {
    setNodeId(undefined);
  };

  /**
   * 监听画布实例变更
   */
  useEffect(() => {
    const disposable = playground.config.onReadonlyOrDisabledChange(() => {
      handleClose();
      refresh();
    });
    console.log('监听到画布实例变更', playground);
    return () => {
      disposable.dispose();
    };
  }, [playground]);

  /**
   * 监听节点选中
   */
  useEffect(() => {
    const toDispose = selection.onSelectionChanged(() => {
      console.log('监听到节点选中', selection);
      /**
       * 如果没有选中任何节点，则自动关闭侧边栏
       * If no node is selected, the sidebar is automatically closed
       */
      if (selection.selection.length === 0) {
        handleClose();
      } else if (selection.selection.length === 1 && selection.selection[0] !== node) {
        handleClose();
      }
    });
    return () => {
      toDispose.dispose();
    };
  }, [selection, handleClose]);

  /**
   * 监听节点销毁
   */
  useEffect(() => {
    if (node) {
      const toDispose = node.onDispose(() => {
        console.log('监听到节点销毁', node);
        setNodeId(undefined);
      });
      return () => {
        toDispose.dispose();
      };
    }
  }, [node]);

  /**
   * 节点渲染
   */
  const visible = node ? !node.getNodeMeta<FlowNodeMeta>().disableSideBar : false;

  if (playground.config.readonly) {
    return null;
  }
  /**
   * 内容
   */
  const content = node ? (
    <PlaygroundEntityContext key={node.id} value={node}>
      <SidebarNodeRenderer node={node} />
    </PlaygroundEntityContext>
  ) : null;

  return (
    <Drawer mask={false} open={visible} onClose={handleClose}>
      <IsSidebarContext value={true}>{content}</IsSidebarContext>
    </Drawer>
  );
};
export default SidebarRenderer;
