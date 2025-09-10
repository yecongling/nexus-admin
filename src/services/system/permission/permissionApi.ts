import { HttpRequest } from '@/utils/request';

/**
 * 权限按钮相关接口枚举
 */
const PermissionApi = {
  // 获取权限按钮列表
  getButtonList: '/system/permission/button/list',
  // 获取权限按钮详情
  getButtonDetail: '/system/permission/button/detail',
  // 新增权限按钮
  addButton: '/system/permission/button/add',
  // 编辑权限按钮
  updateButton: '/system/permission/button/update',
  // 删除权限按钮
  deleteButton: '/system/permission/button/delete',
  // 批量删除权限按钮
  batchDeleteButtons: '/system/permission/button/batchDelete',
  // 切换权限按钮状态
  toggleButtonStatus: '/system/permission/button/toggleStatus',
  // 获取按钮关联的接口权限
  getButtonInterfaces: '/system/permission/button/interfaces',
  // 分配按钮接口权限
  assignButtonInterfaces: '/system/permission/button/assignInterfaces',
  // 获取权限分配列表
  getPermissionAssignList: '/system/permission/assign/list',
  // 分配角色权限
  assignRolePermission: '/system/permission/assign/role',
  // 获取角色权限详情
  getRolePermissionDetail: '/system/permission/assign/roleDetail',
  // 权限使用统计
  getPermissionStatistics: '/system/permission/audit/statistics',
  // 权限变更日志
  getPermissionChangeLog: '/system/permission/audit/changeLog',
  // 异常权限检测
  getAnomalyDetection: '/system/permission/audit/anomaly',
};

/**
 * 权限按钮数据类型
 */
export interface PermissionButton {
  id: string;
  name: string;
  code: string;
  menuId: string;
  menuName: string;
  parentMenuId: string;
  parentMenuName: string;
  description?: string;
  status: boolean;
  sortNo: number;
  createTime: string;
  updateTime: string;
  createBy: string;
  updateBy: string;
}

/**
 * 权限按钮查询参数
 */
export interface ButtonSearchParams {
  name?: string;
  code?: string;
  menuId?: string;
  status?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

/**
 * 权限按钮查询响应
 */
export interface ButtonListResponse {
  records: PermissionButton[];
  pageNumber: number;
  pageSize: number;
  totalPage: number;
  totalRow: number;
}

/**
 * 权限按钮创建/更新参数
 */
export interface ButtonFormData {
  id?: string;
  name: string;
  code: string;
  menuId: string;
  description?: string;
  status?: boolean;
  sortNo?: number;
}

/**
 * 按钮接口权限关联
 */
export interface ButtonInterfacePermission {
  id: string;
  buttonId: string;
  interfaceId: string;
  interfaceCode: string;
  interfaceRemark: string;
  createTime: string;
}

/**
 * 权限分配查询参数
 */
export interface PermissionAssignSearchParams {
  roleId?: string;
  userId?: string;
  permissionType?: 'menu' | 'button' | 'interface';
  pageNumber?: number;
  pageSize?: number;
}

/**
 * 权限分配响应
 */
export interface PermissionAssignResponse {
  records: PermissionAssignItem[];
  pageNumber: number;
  pageSize: number;
  totalPage: number;
  totalRow: number;
}

/**
 * 权限分配项
 */
export interface PermissionAssignItem {
  id: string;
  roleId: string;
  roleName: string;
  permissionType: 'menu' | 'button' | 'interface';
  permissionId: string;
  permissionName: string;
  permissionCode: string;
  assignTime: string;
  assignBy: string;
}

/**
 * 权限统计数据类型
 */
export interface PermissionStatistics {
  totalButtons: number;
  activeButtons: number;
  inactiveButtons: number;
  totalInterfaces: number;
  usedInterfaces: number;
  unusedInterfaces: number;
  topUsedButtons: Array<{
    buttonId: string;
    buttonName: string;
    usageCount: number;
  }>;
  topUsedInterfaces: Array<{
    interfaceId: string;
    interfaceCode: string;
    usageCount: number;
  }>;
}

/**
 * 权限变更日志
 */
export interface PermissionChangeLog {
  id: string;
  operationType: 'create' | 'update' | 'delete' | 'assign' | 'revoke';
  targetType: 'button' | 'interface' | 'role';
  targetId: string;
  targetName: string;
  operatorId: string;
  operatorName: string;
  operationTime: string;
  description: string;
  beforeData?: any;
  afterData?: any;
}

/**
 * 权限管理服务接口
 */
export interface IPermissionService {
  /**
   * 获取权限按钮列表
   * @param params 查询参数
   * @returns 按钮列表
   */
  getButtonList(params: ButtonSearchParams): Promise<ButtonListResponse>;

  /**
   * 获取权限按钮详情
   * @param buttonId 按钮ID
   * @returns 按钮详情
   */
  getButtonDetail(buttonId: string): Promise<PermissionButton>;

  /**
   * 新增权限按钮
   * @param data 按钮数据
   * @returns 新增结果
   */
  addButton(data: ButtonFormData): Promise<boolean>;

  /**
   * 编辑权限按钮
   * @param data 按钮数据
   * @returns 编辑结果
   */
  updateButton(data: ButtonFormData): Promise<boolean>;

  /**
   * 删除权限按钮
   * @param buttonId 按钮ID
   * @returns 删除结果
   */
  deleteButton(buttonId: string): Promise<boolean>;

  /**
   * 批量删除权限按钮
   * @param buttonIds 按钮ID列表
   * @returns 删除结果
   */
  batchDeleteButtons(buttonIds: string[]): Promise<boolean>;

  /**
   * 切换权限按钮状态
   * @param buttonId 按钮ID
   * @param status 状态
   * @returns 切换结果
   */
  toggleButtonStatus(buttonId: string, status: boolean): Promise<boolean>;

  /**
   * 获取按钮关联的接口权限
   * @param buttonId 按钮ID
   * @returns 接口权限列表
   */
  getButtonInterfaces(buttonId: string): Promise<ButtonInterfacePermission[]>;

  /**
   * 分配按钮接口权限
   * @param buttonId 按钮ID
   * @param interfaceIds 接口权限ID列表
   * @returns 分配结果
   */
  assignButtonInterfaces(buttonId: string, interfaceIds: string[]): Promise<boolean>;

  /**
   * 获取权限分配列表
   * @param params 查询参数
   * @returns 权限分配列表
   */
  getPermissionAssignList(params: PermissionAssignSearchParams): Promise<PermissionAssignResponse>;

  /**
   * 分配角色权限
   * @param roleId 角色ID
   * @param permissionType 权限类型
   * @param permissionIds 权限ID列表
   * @returns 分配结果
   */
  assignRolePermission(roleId: string, permissionType: 'menu' | 'button' | 'interface', permissionIds: string[]): Promise<boolean>;

  /**
   * 获取角色权限详情
   * @param roleId 角色ID
   * @returns 角色权限详情
   */
  getRolePermissionDetail(roleId: string): Promise<{
    menuPermissions: string[];
    buttonPermissions: string[];
    interfacePermissions: string[];
  }>;

  /**
   * 获取权限使用统计
   * @param timeRange 时间范围
   * @returns 统计数据
   */
  getPermissionStatistics(timeRange?: { startTime: string; endTime: string }): Promise<PermissionStatistics>;

  /**
   * 获取权限变更日志
   * @param params 查询参数
   * @returns 变更日志列表
   */
  getPermissionChangeLog(params: {
    pageNumber?: number;
    pageSize?: number;
    operationType?: string;
    targetType?: string;
    startTime?: string;
    endTime?: string;
  }): Promise<{
    records: PermissionChangeLog[];
    pageNumber: number;
    pageSize: number;
    totalPage: number;
    totalRow: number;
  }>;

  /**
   * 获取异常权限检测结果
   * @param params 查询参数
   * @returns 异常检测结果
   */
  getAnomalyDetection(params: {
    pageNumber?: number;
    pageSize?: number;
    anomalyType?: string;
  }): Promise<{
    records: Array<{
      id: string;
      anomalyType: string;
      description: string;
      severity: 'low' | 'medium' | 'high';
      detectedTime: string;
      status: 'pending' | 'resolved' | 'ignored';
    }>;
    pageNumber: number;
    pageSize: number;
    totalPage: number;
    totalRow: number;
  }>;
}

/**
 * 权限管理服务实现
 */
export const permissionService: IPermissionService = {
  /**
   * 获取权限按钮列表
   */
  async getButtonList(params: ButtonSearchParams): Promise<ButtonListResponse> {
    return HttpRequest.get<ButtonListResponse>({
      url: PermissionApi.getButtonList,
      params,
    });
  },

  /**
   * 获取权限按钮详情
   */
  async getButtonDetail(buttonId: string): Promise<PermissionButton> {
    return HttpRequest.get<PermissionButton>({
      url: PermissionApi.getButtonDetail,
      params: { buttonId },
    });
  },

  /**
   * 新增权限按钮
   */
  async addButton(data: ButtonFormData): Promise<boolean> {
    return HttpRequest.post({
      url: PermissionApi.addButton,
      data,
    });
  },

  /**
   * 编辑权限按钮
   */
  async updateButton(data: ButtonFormData): Promise<boolean> {
    return HttpRequest.post({
      url: PermissionApi.updateButton,
      data,
    });
  },

  /**
   * 删除权限按钮
   */
  async deleteButton(buttonId: string): Promise<boolean> {
    return HttpRequest.delete({
      url: PermissionApi.deleteButton,
      params: { buttonId },
    });
  },

  /**
   * 批量删除权限按钮
   */
  async batchDeleteButtons(buttonIds: string[]): Promise<boolean> {
    return HttpRequest.post({
      url: PermissionApi.batchDeleteButtons,
      data: { buttonIds },
    });
  },

  /**
   * 切换权限按钮状态
   */
  async toggleButtonStatus(buttonId: string, status: boolean): Promise<boolean> {
    return HttpRequest.post({
      url: PermissionApi.toggleButtonStatus,
      data: { buttonId, status },
    });
  },

  /**
   * 获取按钮关联的接口权限
   */
  async getButtonInterfaces(buttonId: string): Promise<ButtonInterfacePermission[]> {
    return HttpRequest.get<ButtonInterfacePermission[]>({
      url: PermissionApi.getButtonInterfaces,
      params: { buttonId },
    });
  },

  /**
   * 分配按钮接口权限
   */
  async assignButtonInterfaces(buttonId: string, interfaceIds: string[]): Promise<boolean> {
    return HttpRequest.post({
      url: PermissionApi.assignButtonInterfaces,
      data: { buttonId, interfaceIds },
    });
  },

  /**
   * 获取权限分配列表
   */
  async getPermissionAssignList(params: PermissionAssignSearchParams): Promise<PermissionAssignResponse> {
    return HttpRequest.get<PermissionAssignResponse>({
      url: PermissionApi.getPermissionAssignList,
      params,
    });
  },

  /**
   * 分配角色权限
   */
  async assignRolePermission(roleId: string, permissionType: 'menu' | 'button' | 'interface', permissionIds: string[]): Promise<boolean> {
    return HttpRequest.post({
      url: PermissionApi.assignRolePermission,
      data: { roleId, permissionType, permissionIds },
    });
  },

  /**
   * 获取角色权限详情
   */
  async getRolePermissionDetail(roleId: string): Promise<{
    menuPermissions: string[];
    buttonPermissions: string[];
    interfacePermissions: string[];
  }> {
    return HttpRequest.get({
      url: PermissionApi.getRolePermissionDetail,
      params: { roleId },
    });
  },

  /**
   * 获取权限使用统计
   */
  async getPermissionStatistics(timeRange?: { startTime: string; endTime: string }): Promise<PermissionStatistics> {
    return HttpRequest.get<PermissionStatistics>({
      url: PermissionApi.getPermissionStatistics,
      params: timeRange,
    });
  },

  /**
   * 获取权限变更日志
   */
  async getPermissionChangeLog(params: {
    pageNumber?: number;
    pageSize?: number;
    operationType?: string;
    targetType?: string;
    startTime?: string;
    endTime?: string;
  }): Promise<{
    records: PermissionChangeLog[];
    pageNumber: number;
    pageSize: number;
    totalPage: number;
    totalRow: number;
  }> {
    return HttpRequest.get({
      url: PermissionApi.getPermissionChangeLog,
      params,
    });
  },

  /**
   * 获取异常权限检测结果
   */
  async getAnomalyDetection(params: {
    pageNumber?: number;
    pageSize?: number;
    anomalyType?: string;
  }): Promise<{
    records: Array<{
      id: string;
      anomalyType: string;
      description: string;
      severity: 'low' | 'medium' | 'high';
      detectedTime: string;
      status: 'pending' | 'resolved' | 'ignored';
    }>;
    pageNumber: number;
    pageSize: number;
    totalPage: number;
    totalRow: number;
  }> {
    return HttpRequest.get({
      url: PermissionApi.getAnomalyDetection,
      params,
    });
  },
};
