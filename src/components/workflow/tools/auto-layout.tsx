import { usePlayground, usePlaygroundTools } from '@flowgram.ai/free-layout-editor';
import { Button, Tooltip } from 'antd';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { IconAutoLayout } from '../icons/icon-auto-layout';
import { useCallback } from 'react';

/**
 * 自动布局
 * @returns
 */
const AutoLayout: React.FC = () => {
  const { t } = useTranslation();
  const tools = usePlaygroundTools();
  const playground = usePlayground();
  const autoLayout = useCallback(async () => {
    await tools.autoLayout();
  }, [tools]);
  return (
    <Tooltip title={t('workflow.tools.autoLayout')}>
      <Button type="text" onClick={autoLayout} disabled={playground.config.readonly} icon={IconAutoLayout} />
    </Tooltip>
  );
};
export default AutoLayout;
