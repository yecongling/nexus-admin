import { usePlayground } from "@flowgram.ai/free-layout-editor";
import { useCallback, useEffect, useState } from "react";
import { CommentEditorEvent } from "@/components/workflow/nodes/comment/constant";
import type { CommentEditorModel } from "@/components/workflow/nodes/comment/model";

/**
 * 节点内容超出
 */
export const useOverflow = (params: {
  model: CommentEditorModel;
  height: number;
}) => {
  const { model, height } = params;

  const playground = usePlayground();
  const [overflow, setOverflow] = useState(false);

  /**
   * 判断节点内容是否超出
   */
  const isOverflow = useCallback(() => {
    if (!model.element) {
      return false;
    }
    return model.element.scrollHeight > model.element.clientHeight;
  }, [model, height, playground]);

  // 更新overflow
  const updateOverflow = useCallback(() => {
    setOverflow(isOverflow());
  }, [model, height, playground]);

  // 监听高度变化
  useEffect(() => {
    updateOverflow();
  }, [height, updateOverflow]);
  // 监听change事件
  useEffect(() => {
    const disposer = model.on((params) => {
      if (params.type === CommentEditorEvent.Change) return;
      updateOverflow();
    });
    return () => disposer.dispose();
  }, [model, updateOverflow]);

  return {
    overflow,
    updateOverflow,
  };
};
