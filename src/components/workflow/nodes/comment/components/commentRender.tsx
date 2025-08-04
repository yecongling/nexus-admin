import type { WorkflowNodeEntity } from '@flowgram.ai/free-layout-editor';
import './index.scss';

/**
 * 注释组件
 * @returns
 */
export const CommentRender = ({ node }: { node: WorkflowNodeEntity }) => {
  return <div className="workflow-comment">注释组件</div>;
};
