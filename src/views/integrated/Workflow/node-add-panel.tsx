import {
  useService,
  WorkflowDragService,
} from "@flowgram.ai/free-layout-editor";
import { usePreferencesStore } from "@/stores/store";

/**
 * 左边可添加的节点面板
 * 显示所有的节点，可拖动到右边画布上
 * @returns
 */
const NodeAddPanel: React.FC = () => {
  // 拖拽服务
  const startDragService = useService<WorkflowDragService>(WorkflowDragService);
  // 主题
  const colorPrimary = usePreferencesStore(
    (state) => state.preferences.theme.colorPrimary
  );

  return (
    <div className="workflow-sidebar flex flex-col flex-auto">
      <div className="workflow-sidebar-header">
        <div className="workflow-sidebar-header-title">节点列表</div>
      </div>
      <div
        className="w-full h-full"
        style={{ backgroundColor: colorPrimary }}
        onMouseDown={(e) =>
          startDragService.startDragCard("card", e, {
            data: {
              type: "card",
              title: "卡片",
              content: "卡片内容",
            },
          })
        }
      />
    </div>
  );
};
export default NodeAddPanel;
