import { useQuery } from "@tanstack/react-query";
import { Card } from "antd";
import type React from "react";
import type { MenuModel } from "@/services/system/menu/type";

/**
 * 菜单接口权限
 * @returns 菜单接口权限
 */
const MenuInterfacePermission: React.FC<MenuInterfacePermissionProps> = ({ menu }) => {
  // 查询菜单接口权限数据
  const { isLoading, data, refetch } = useQuery({
    queryKey: ['menu-interface-permission', menu?.id],
    queryFn: () => {
      return {}
    },
    enabled: menu !== undefined,
  })

  // 删除接口mutation


  return (
    <Card className="flex-1 max-h-full">
      MenuInterfacePermission
    </Card>
  );
};
export default MenuInterfacePermission;

export type MenuInterfacePermissionProps = {
  menu?: MenuModel;
}