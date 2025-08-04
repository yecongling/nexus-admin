import { NodeRenderContext } from '@/context/workflow/node-render-context';
import {
  useNodeRender,
  type FlowNodeEntity,
} from '@flowgram.ai/free-layout-editor';

/**
 * 弹窗节点渲染
 */
export function NodeModalRenderer(props: { node: FlowNodeEntity }) {
  const { node } = props;
  const nodeRender = useNodeRender(node);
  return (
    <NodeRenderContext value={nodeRender}>
      {nodeRender.form?.render()}
    </NodeRenderContext>
  );
}
