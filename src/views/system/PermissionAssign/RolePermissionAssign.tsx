import type React from 'react';
import RolePermissionAssign from './components/RolePermissionAssign';

/**
 * 角色权限分配组件包装器
 * 为角色分配菜单权限、按钮权限和接口权限
 */
const RolePermissionAssignWrapper: React.FC = () => {
  return <RolePermissionAssign />;
};

export default RolePermissionAssignWrapper;
