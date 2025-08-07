import { Flex } from 'antd';
import MenuIcon from './MenuIcon';

/**
 * 快捷菜单
 * @returns
 */
const ShortCutMenu: React.FC = () => {
  return (
    <Flex wrap="wrap" gap="large" justify="end">
      <MenuIcon />
    </Flex>
  );
};
export default ShortCutMenu;
