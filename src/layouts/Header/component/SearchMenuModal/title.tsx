import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';

/**
 * 搜索菜单模态框标题组件
 * @returns 搜索菜单模态框标题组件
 */
const Title: React.FC = () => {

  return (
    <div className='flex justify-start items-center'>
      <Input placeholder='搜索导航菜单' variant='borderless'  prefix={<SearchOutlined style={{ cursor: 'pointer', fontSize: '18px' }} />} />
    </div>
  );
};
export default Title;