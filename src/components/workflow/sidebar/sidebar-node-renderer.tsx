import { NodeRenderContext } from '@/context/workflow/node-render-context';
import {
  useNodeRender,
  type FlowNodeEntity,
} from '@flowgram.ai/free-layout-editor';

export function SidebarNodeRenderer(props: { node: FlowNodeEntity }) {
  const { node } = props;
  const nodeRender = useNodeRender(node);

  return (
    <NodeRenderContext value={nodeRender}>
      {nodeRender.form?.render()}
    </NodeRenderContext>
  );
}
