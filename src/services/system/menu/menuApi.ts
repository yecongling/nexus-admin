import { HttpRequest } from '@/utils/request';
import type { MenuDirectoryItem, MenuModel } from './type';

/**
 * 菜单相关接口枚举
 */
const MenuApi = {
  // 根据token获取菜单（多用于框架上根据角色获取菜单那种）
  getMenuList: '/system/menu/getMenusByRole',
  // 获取所有菜单
  getAllMenus: '/system/menu/getAllMenus',
  // 获取所有上级菜单
  getDirectory: '/system/menu/getDirectory',
  // 添加菜单
  addMenu: '/system/menu/addMenu',
  // 编辑菜单
  updateMenu: '/system/menu/updateMenu',
  // 删除菜单
  deleteMenu: '/system/menu/deleteMenu',
  // 批量删除菜单
  deleteMenuBatch: '/system/menu/deleteMenuBatch',
  // 切换菜单状态
  toggleMenuStatus: '/system/menu/toggleMenuStatus',
  // 导出（Excel）
  exportMenus: '/system/menu/export',
  // 批量导入
  importMenus: '/system/menu/import',
  // 验证菜单权限
  checkPermission: '/system/menu/checkPermission',
};

/**
 * 菜单相关接口查询参数
 */
interface MenuSearchParams {
  /**
   * 菜单名称
   */
  name?: string;
}

/**
 * 菜单管理服务接口
 */
interface IMenuService {
  /**
   * 根据角色获取菜单
   * @param roleId 角色ID
   * @returns 菜单列表
   */
  getMenuListByRoleId(roleId: string): Promise<any[]>;

  /**
   * 查询所有菜单
   * @param params 查询参数
   * @returns 菜单列表
   */
  getAllMenus(name?: string): Promise<MenuModel[]>;

  /**
   * 获取所有的菜单目录（如果选中的是按钮，就不止以及菜单）
   * @returns 菜单列表
   */
  getDirectory(): Promise<MenuDirectoryItem[]>;

  /**
   * 新增菜单
   * @param params 菜单数据
   * @returns 新增结果
   */
  addMenu(params: Partial<MenuModel>): Promise<boolean>;

  /**
   * 修改菜单
   * @param params 菜单数据
   * @returns 修改结果
   */
  updateMenu(params: Partial<MenuModel>): Promise<boolean>;

  /**
   * 删除菜单
   * @param menuId 菜单ID
   * @returns 删除结果
   */
  deleteMenu(menuId: string): Promise<boolean>;

  /**
   * 批量删除菜单
   * @param menuIds 菜单ID列表
   * @returns 删除结果
   */
  deleteMenuBatch(menuIds: string[]): Promise<boolean>;

  /**
   * 切换菜单状态
   * @param id 菜单ID
   * @param status 状态
   * @returns 切换结果
   */
  toggleMenuStatus(id: string, status: boolean): Promise<boolean>;

  /**
   * 导出菜单
   * @param params 查询参数
   * @returns 菜单数据
   */
  exportMenus(params: MenuSearchParams): Promise<Blob>;

  /**
   * 导入菜单
   * @param file 文件
   * @returns 导入结果
   */
  importMenus(file: File): Promise<boolean>;

  /**
   * 验证菜单权限
   * @param menuId 菜单ID
   * @returns 验证结果
   */
  checkPermission(menuId: string): Promise<boolean>;
}

/**
 * 菜单管理服务实现
 */
export const menuService: IMenuService = {
  /**
   * 根据角色获取菜单
   * @param roleId 角色ID
   * @returns 菜单列表
   */
  getMenuListByRoleId(roleId: string): Promise<any[]> {
    return HttpRequest.get(
      {
        url: MenuApi.getMenuList,
        params: { roleId },
      },
      { successMessageMode: 'none' },
    );
  },

  /**
   * 查询所有菜单
   * @param params 查询参数
   * @returns 菜单列表
   */
  async getAllMenus(name?: string): Promise<MenuModel[]> {
    const data = await HttpRequest.post(
      {
        url: MenuApi.getAllMenus,
        params: { name },
      },
      { successMessageMode: 'none' },
    );
    return transformMenuData(data);
  },
  /**
   * 获取所有的一级菜单
   * @returns 菜单列表
   */
  getDirectory(): Promise<MenuDirectoryItem[]> {
    return HttpRequest.get(
      {
        url: MenuApi.getDirectory,
      },
      { successMessageMode: 'none' },
    );
  },
  /**
   * 新增菜单
   * @param params 菜单数据
   * @returns 新增结果
   */
  addMenu(params: Partial<MenuModel>): Promise<boolean> {
    return HttpRequest.post({
      url: MenuApi.addMenu,
      data: params,
    });
  },
  /**
   * 修改菜单
   * @param params 菜单数据
   * @returns 修改结果
   */
  updateMenu(params: Partial<MenuModel>): Promise<boolean> {
    return HttpRequest.post({
      url: MenuApi.updateMenu,
      data: params,
    });
  },
  /**
   * 删除菜单
   * @param menuId 菜单ID
   * @returns 删除结果
   */
  deleteMenu(menuId: string): Promise<boolean> {
    return HttpRequest.delete({
      url: MenuApi.deleteMenu,
      params: { menuId },
    });
  },
  /**
   * 批量删除菜单
   * @param menuIds 菜单ID列表
   * @returns 删除结果
   */
  deleteMenuBatch(menuIds: string[]): Promise<boolean> {
    return HttpRequest.delete({
      url: MenuApi.deleteMenuBatch,
      data: { menuIds },
    });
  },

  /**
   * 切换菜单状态
   * @param id 菜单ID
   * @param status 状态
   * @returns 切换结果
   */
  toggleMenuStatus(id: string, status: boolean): Promise<boolean> {
    return HttpRequest.post({
      url: MenuApi.toggleMenuStatus,
      data: { id, status },
    });
  },

  /**
   * 导出菜单
   * @param params 查询参数
   * @returns 菜单数据
   */
  exportMenus(params: MenuSearchParams): Promise<Blob> {
    return HttpRequest.post({
      url: MenuApi.exportMenus,
      data: params,
      responseType: 'blob',
    });
  },
  /**
   * 导入菜单
   * @param file 文件
   * @returns 导入结果
   */
  importMenus(file: File): Promise<boolean> {
    const formData = new FormData();
    formData.append('file', file);
    return HttpRequest.post({
      url: MenuApi.importMenus,
      data: formData,
    });
  },
  /**
   * 验证菜单权限
   * @param menuId 菜单ID
   * @returns 验证结果
   */
  checkPermission(menuId: string): Promise<boolean> {
    return HttpRequest.post({
      url: MenuApi.checkPermission,
      data: { menuId },
    });
  },
};

/**
 * 转换菜单数据，children没有数据的转换为null
 * @param data
 */
function transformMenuData(data: any) {
  return data.map((item: any) => ({
    ...item,
    children: item.children?.length ? transformMenuData(item.children) : null,
  }));
}
