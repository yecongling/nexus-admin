import { DownOutlined } from '@ant-design/icons';
import { Button, Checkbox, Dropdown, type MenuProps } from 'antd';

/**
 * 模版中心头部类型切换
 */
const TemplateTypeDropdown: React.FC<TemplateTypeDropdownProps> = ({
  onTypeChange,
}) => {
  // 下拉选项
  const items: MenuProps['items'] = [
    {
      label: <Checkbox>集成项目</Checkbox>,
      key: '1',
    },
    {
      label: '接口项目',
      key: '2',
    },
    {
      label: '3rd menu item',
      key: '3',
    },
    {
      label: '4rd menu item',
      key: '4',
      disabled: true,
    },
  ];
  return (
    <Dropdown trigger={['click']} menu={{ items }}>
      <Button type="text">
        所有类型
        <DownOutlined />
      </Button>
    </Dropdown>
  );
};
export default TemplateTypeDropdown;

/**
 * 模版中心头部类型切换属性
 */
export interface TemplateTypeDropdownProps {
  // 类型切换
  onTypeChange: (types: number[]) => void;
}
