import type { MenuProps } from 'antd';
import type { RouteItem } from '@/types/route';

/**
 * 布局菜单属性
 */
interface LayoutMenuProps extends MenuProps {
  menus?: RouteItem[];
  // 菜单选中事件
  handleMenuSelect?: (key: string) => void;

  // 菜单展开事件
  handleMenuOpen?: (key: string, path: string[]) => void;
}

/**
 * 布局菜单
 * @returns
 */
const LayoutMenu: React.FC<LayoutMenuProps> = () => {
  return <div>布局菜单</div>;
};
export default LayoutMenu;
