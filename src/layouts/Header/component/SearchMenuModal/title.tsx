import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { Input } from 'antd';

interface TitleProps {
  searchValue: string;
  onSearch: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<any>;
}

/**
 * 搜索菜单模态框标题组件
 * @returns 搜索菜单模态框标题组件
 */
const Title: React.FC<TitleProps> = ({
  searchValue,
  onSearch,
  onKeyDown,
  inputRef
}) => {
  const handleClear = () => {
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <div className='flex justify-start items-center'>
      <Input 
        ref={inputRef}
        className='w-[95%]!'
        placeholder='搜索导航菜单 (支持模糊搜索)' 
        variant='borderless'
        value={searchValue}
        onChange={(e) => onSearch(e.target.value)}
        onKeyDown={onKeyDown}
        prefix={<SearchOutlined style={{ cursor: 'pointer', fontSize: '18px' }} />}
        suffix={
          searchValue && (
            <ClearOutlined
              style={{ cursor: 'pointer', fontSize: '14px', color: '#999' }}
              onClick={handleClear}
            />
          )
        }
        allowClear={false}
      />
    </div>
  );
};

export default Title;