import {
  useService,
  WorkflowLinesManager,
} from '@flowgram.ai/free-layout-editor';
import { Button, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { IconSwitchLine } from '../icons/icon-switch-line';

/**
 * 线条切换
 * @returns
 */
const SwitchLine: React.FC = () => {
  const { t } = useTranslation();
  const linesManager = useService(WorkflowLinesManager);
  const switchLine = () => {
    linesManager.switchLineType();
  };
  return (
    <Tooltip title={t('workflow.tools.switchLine')}>
      <Button type="text" icon={IconSwitchLine} onClick={switchLine} />
    </Tooltip>
  );
};
export default SwitchLine;
