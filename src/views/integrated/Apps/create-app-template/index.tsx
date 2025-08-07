import DragModal from '@/components/modal/DragModal';
import { Input } from 'antd';
import type React from 'react';
import TemplateTypeDropdown from '../components/TemplateTypeDropdown';
import { memo } from 'react';

/**
 * 模版中心
 * @returns
 */
const AppTemplates: React.FC<AppsTemplateModelProps> = ({ open, onClose, onCreateFromBlank }) => {
  /**
   * 模版中心头部检索
   */
  const onSearch = (type: number, value: string) => {
    console.log(type, value);
  };

  /**
   * 模版中心头部类型切换
   */
  const onTypeChange = (type: number[]) => {
    console.log(type);
  };

  return (
    <DragModal
      footer={null}
      centered
      style={{ height: '95vh' }} // 控制 Modal 外壳
      styles={{ body: { height: 'calc(95vh - 92px)', overflowY: 'auto' } }}
      width="95%"
      open={open}
      title={<TemplateHeaders onSearch={onSearch} onTypeChange={onTypeChange} />}
      onCancel={onClose}
    >
      <div className="relative flex h-full overflow-y-auto">
        <div className="h-full w-[200px] p-4">左边分类</div>
        <div className="h-full flex-1 shrink-0 grow overflow-auto border-l p-6 pt-2 border-[#1018280a]">右边模板</div>
      </div>
    </DragModal>
  );
};
export default memo(AppTemplates);

/**
 * 模版中心头部
 */
const TemplateHeaders: React.FC<TemplateHeadersProps> = ({ onTypeChange, onSearch }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="min-w-[180px] pl-5">
        <span>从应用模板创建</span>
      </div>
      <div className="flex-1 max-w-[548px] p-1.5 flex items-center">
        <Input
          className="w-full h-10"
          size="large"
          placeholder="搜索所有模版"
          addonBefore={<TemplateTypeDropdown onTypeChange={onTypeChange} />}
          onPressEnter={(e) => onSearch(1, (e.target as any).value)}
        />
      </div>
      <div className="w-[180px] h-8" />
    </div>
  );
};

interface TemplateHeadersProps {
  // 类型切换
  onTypeChange: (types: number[]) => void;
  // 搜索
  onSearch: (type: number, value: string) => void;
}

/**
 * 模版中心弹窗参数
 */
export interface AppsTemplateModelProps {
  open: boolean;
  onClose: () => void;
  // 从空白项目创建
  onCreateFromBlank: () => void;
}
