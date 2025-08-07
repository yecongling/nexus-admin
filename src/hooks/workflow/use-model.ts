import { CommentEditorFormField } from '@/components/workflow/nodes/comment/constant';
import { CommentEditorModel } from '@/components/workflow/nodes/comment/model';
import {
  FlowNodeFormData,
  type FormModelV2,
  useEntityFromContext,
  useNodeRender,
  type WorkflowNodeEntity,
} from '@flowgram.ai/free-layout-editor';
import { useEffect, useMemo } from 'react';

/**
 * 创建节点模型的
 */
export const useModel = () => {
  const node = useEntityFromContext<WorkflowNodeEntity>();
  const { selected: focused } = useNodeRender();

  const formModel = node.getData(FlowNodeFormData).getFormModel<FormModelV2>();

  const model = useMemo(() => new CommentEditorModel(), []);

  // 同步失焦状态
  useEffect(() => {
    if (focused) {
      return;
    }
    model.setFocus(focused);
  }, [focused, model]);

  // 同步表单值初始化
  useEffect(() => {
    const value = formModel.getValueIn<string>(CommentEditorFormField.Note);
    model.setValue(value); // 设置初始值
    model.selectEnd(); // 光标定位到末尾
  }, [formModel, model]);

  // 同步表单外部值变化：undo/redo/协同
  useEffect(() => {
    const disposer = formModel.onFormValuesChange(({ name }) => {
      if (name !== CommentEditorFormField.Note) {
        return;
      }
      const value = formModel.getValueIn<string>(CommentEditorFormField.Note);
      model.setValue(value);
    });
    return () => disposer.dispose();
  }, [formModel, model]);

  return model;
};
