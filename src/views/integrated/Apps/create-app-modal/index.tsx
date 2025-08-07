import { memo, useRef, useState } from 'react';
import { Button, Input, Select, Space, type InputRef } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { ApartmentOutlined, ArrowRightOutlined } from '@ant-design/icons';
import DragModal from '@/components/modal/DragModal';
import type { App } from '@/services/integrated/apps/app';
import { usePreferencesStore } from '@/stores/store';
import { useTranslation } from 'react-i18next';
import { usePlatformHotkey } from '@/hooks/usePlatformHotkey';
import { getShortcutLabel } from '@/utils/utils';

/**
 * 添加项目弹窗
 * @returns
 */
const AppInfoModal: React.FC<AppInfoModalProps> = ({ open, onOk, onCancel, onCreateFromTemplate }) => {
  const inputRef = useRef<InputRef>(null);
  // 项目类型
  const [type, setType] = useState<number>(1);
  // 项目名称
  const [name, setName] = useState<string>('');
  // 项目描述
  const [description, setDescription] = useState<string>('');
  // 日志级别
  const [logLevel, setLogLevel] = useState<number>(1);
  // 主题
  const { preferences } = usePreferencesStore();
  const { theme } = preferences;
  const { t } = useTranslation();

  // 绑定保存的快捷键
  const shotcut = usePlatformHotkey({
    mac: 'meta+s',
    windows: 'ctrl+s',
    handler: (event) => {
      event.preventDefault();
      if (name.trim().length > 0) {
        handleOk();
      }
    },
  });

  /**
   * 选择类型
   * @param value 选择的类型
   */
  const selectType = (value: number) => {
    setType(value);
  };

  /**
   * 点击确认的回调
   */
  const handleOk = () => {
    const data = {
      type,
      name,
      description,
      logLevel,
    };
    onOk(data);
  };

  return (
    <DragModal
      onCancel={onCancel}
      open={open}
      footer={null}
      centered
      style={{ height: '95vh' }} // 控制 Modal 外壳
      styles={{
        body: { height: 'calc(95vh - 50px)', overflowY: 'auto' },
        header: { padding: '20px', borderBottom: 'none' },
      }}
      width="95%"
    >
      <div className="flex justify-center h-full overflow-y-auto overflow-x-hidden">
        {/* 左边显示 */}
        <div className="flex-1 shrink-0 flex justify-end">
          <div className="px-10">
            <div className="w-full h-2 2xl:h-[30px]" />
            <div className="pt-1 pb-6">
              <span className="font-semibold text-[18px] leading-[1.2] text-[#101828]">创建空白应用</span>
            </div>
            <div className="leading-6 mb-2">
              <span className="text-[#354052] text-[13px] font-semibold leading-4">选择应用类型</span>
            </div>
            <div className="flex flex-col w-[660px] gap-4">
              {/* 基础使用 */}
              <div className="w-full">
                <div className="mb-2">
                  <span className="text-[#676f83] text-[10px] font-medium leading-3">基础使用</span>
                </div>
                <div className="flex flex-row gap-2">
                  <div
                    className="w-[191px] h-[84px] p-3 border-[1px] relative box-content! rounded-xl cursor-pointer shadow-xs hover:shadow-md"
                    style={{ borderColor: type === 1 ? theme.colorPrimary : '#e9ebf0' }}
                    onClick={() => selectType(1)}
                  >
                    <div className="w-6 h-6 bg-[#7839ee] rounded-md justify-center items-center flex">
                      <ApartmentOutlined className="w-4 h-4 text-[#ffffffe5]!" />
                    </div>
                    <div className="text-[#354052] mt-2 mb-0.5 text-[13px] font-semibold leading-4">集成应用</div>
                    <div className="text-[#676f83] text-[12px] font-normal leading-4">内置高性能调用的数据调度</div>
                  </div>
                  <div
                    className="w-[191px] h-[84px] p-3 border-[1px] relative box-content! rounded-xl cursor-pointer shadow-xs hover:shadow-md"
                    style={{ borderColor: type === 2 ? theme.colorPrimary : '#e9ebf0' }}
                    onClick={() => selectType(2)}
                  >
                    <div className="w-6 h-6 bg-[#7839ee] rounded-md justify-center items-center flex">
                      <ApartmentOutlined className="w-4 h-4 text-[#ffffffe5]!" />
                    </div>
                    <div className="text-[#354052] mt-2 mb-0.5 text-[13px] font-semibold leading-4">接口应用</div>
                    <div className="text-[#676f83] text-[12px] font-normal leading-4">内置高性能调用的数据调度</div>
                  </div>
                  <div
                    className="w-[191px] h-[84px] p-3 border-[1px] relative box-content! rounded-xl cursor-pointer shadow-xs hover:shadow-md"
                    style={{ borderColor: type === 3 ? theme.colorPrimary : '#e9ebf0' }}
                    onClick={() => selectType(3)}
                  >
                    <div className="w-6 h-6 bg-[#7839ee] rounded-md justify-center items-center flex">
                      <ApartmentOutlined className="w-4 h-4 text-[#ffffffe5]!" />
                    </div>
                    <div className="text-[#354052] mt-2 mb-0.5 text-[13px] font-semibold leading-4">三方应用</div>
                    <div className="text-[#676f83] text-[12px] font-normal leading-4">内置高性能调用的数据调度</div>
                  </div>
                </div>
              </div>
              {/* 进阶使用 */}
              <div className="w-full">
                <div className="mb-2">
                  <span className="text-[#676f83] text-[10px] font-medium leading-3">进阶使用</span>
                </div>
                <div className="flex flex-row gap-2">
                  <div
                    className="w-[191px] h-[84px] p-3 border-[0.5px] relative box-content! rounded-xl cursor-pointer shadow-xs hover:shadow-md"
                    style={{ borderColor: type === 4 ? theme.colorPrimary : '#e9ebf0' }}
                    onClick={() => selectType(4)}
                  >
                    <div className="w-6 h-6 bg-[#7839ee] rounded-md justify-center items-center flex">
                      <ApartmentOutlined className="w-4 h-4 text-[#ffffffe5]!" />
                    </div>
                    <div className="text-[#354052] mt-2 mb-0.5 text-[13px] font-semibold leading-4">工作流</div>
                    <div className="text-[#676f83] text-[12px] font-normal leading-4">内置高性能调用的数据调度</div>
                  </div>
                </div>
              </div>
              {/* 分割线 */}
              <div className="w-full h-[0.5px] my-2 bg-[#10182814]" />
              {/* 应用名称 */}
              <div className="flex space-x-3 items-center">
                <div className="flex-1">
                  <div className="h-6 flex items-center mb-1">
                    <span>应用名称 & 图标</span>
                  </div>
                  <div className="relative w-full">
                    <Input
                      ref={inputRef}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-10"
                      placeholder="给你的应用起一个名字"
                      size="middle"
                      allowClear
                      maxLength={20}
                    />
                  </div>
                </div>
              </div>
              {/* 描述 */}
              <div>
                <div className="mb-1 flex h-6 items-center">
                  <span className="">描述</span>
                  <span>（可选）</span>
                </div>
                <TextArea rows={3} placeholder="输入应用的描述" onChange={(e) => setDescription(e.target.value)} />
              </div>
              {/* 优先级 */}
              {/* 日志级别 */}
              <div>
                <Select
                  options={[
                    {
                      label: 'DEBUG',
                      value: 1,
                    },
                    {
                      label: 'INFO',
                      value: 2,
                    },
                    {
                      label: 'WARN',
                      value: 3,
                    },
                    {
                      label: 'ERROR',
                      value: 4,
                    },
                  ]}
                  defaultValue={1}
                  className="w-full h-10"
                  placeholder="日志级别"
                  size="middle"
                  allowClear
                  onChange={(value) => setLogLevel(value)}
                  maxLength={20}
                />
              </div>
            </div>
            {/* 操作按钮-跳转模板 */}
            <div className="pt-5 pb-10 flex justify-between items-center">
              <div
                className="flex gap-1 items-center cursor-pointer text-[12px] text-[#676f83] font-normal leading-4"
                onClick={onCreateFromTemplate}
              >
                <span>不知道？试试我们的模板</span>
                <div className="p-[1px]">
                  <ArrowRightOutlined />
                </div>
              </div>
              <Space>
                <Button type="default" onClick={onCancel}>
                  {t('common.operation.cancel')}
                </Button>
                <Button type="primary" disabled={name.trim().length === 0} onClick={handleOk}>
                  {t('common.operation.confirm')}({getShortcutLabel(shotcut)})
                </Button>
              </Space>
            </div>
          </div>
        </div>
        {/* 右边显示 */}
        <div className="flex-1 shrink-0 flex justify-start relative overflow-hidden">
          <div className="h-2 2xl:h-[39px] absolute left-0 top-0 right-0 border-b border-b-[#1018280a]" />
          <div className="max-w-[760px] border-x border-x-[#1018080a]">
            <div className="w-full h-2 2xl:h-[30px]" />
            <div className="px-8 py-4">
              <h4 className="text-[#354052] text-[13px] font-bold leading-4">显示描述</h4>
              <div className="text-[12px] font-normal leading-4 text-[#676f83] mt-1 min-h-8 max-w-96">
                <span>通过简单的配置快速搭建一个基于流程的数据流动</span>
                <a target="_blank" rel="noreferrer" className="ml-1 text-[#155aef]" href="https://www.baidu.com">
                  了解更多
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DragModal>
  );
};
export default memo(AppInfoModal);

/**
 * 项目弹窗属性
 */
export interface AppInfoModalProps {
  /**
   * 窗口是否打开
   */
  open: boolean;
  /**
   * 窗口确认按钮点击回调
   * @returns
   */
  onOk: (app: Partial<App>) => void;
  /**
   * 窗口取消按钮点击回调
   * @returns
   */
  onCancel: () => void;

  /**
   * 从模板创建
   * @returns
   */
  onCreateFromTemplate: () => void;
}
