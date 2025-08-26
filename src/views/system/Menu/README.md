# 菜单接口权限组件优化说明

## 优化内容

### 1. 状态管理优化
- **合并状态**: 将原来分散的多个 `useState` 合并为一个 `ComponentState` 对象
- **统一更新**: 使用 `updateState` 辅助函数统一管理状态更新
- **减少重渲染**: 通过状态合并减少不必要的组件重渲染

### 2. 性能优化
- **useCallback**: 所有事件处理函数都使用 `useCallback` 包装，避免每次渲染都重新创建
- **useMemo**: 表格列定义使用 `useMemo` 优化，避免每次渲染都重新创建列配置
- **依赖优化**: 合理设置 `useCallback` 和 `useMemo` 的依赖数组

### 3. React Query 集成
- **查询优化**: 使用 `useQuery` 管理数据获取，支持缓存和自动重试
- **变更管理**: 使用 `useMutation` 管理增删改操作
- **乐观更新**: 支持本地状态更新和服务器同步

### 4. API 服务化
- **接口封装**: 接口权限相关API已合并到 `menuApi.ts` 中，通过 `menuService` 统一管理
- **类型安全**: 完整的 TypeScript 类型定义
- **错误处理**: 统一的错误处理机制

### 5. 菜单导入导出功能
- **Excel导入**: 支持 .xlsx 和 .xls 格式文件导入
- **文件验证**: 自动验证文件格式和大小（最大10MB）
- **批量导入**: 支持批量导入菜单数据
- **Excel导出**: 支持导出菜单数据为Excel格式
- **筛选导出**: 支持按菜单名称筛选导出

## 使用方法

### 基本用法
```tsx
import MenuInterfacePermission from '@/views/system/Menu/menu-interface-permission';

<MenuInterfacePermission menu={menuData} />
```

### API 接口
组件会自动调用以下接口（通过 `menuService` 统一管理）：

1. **查询列表**: `GET /api/menu/interface-permissions`
2. **创建权限**: `POST /api/menu/interface-permissions`
3. **更新权限**: `PUT /api/menu/interface-permissions/:id`
4. **删除权限**: `DELETE /api/menu/interface-permissions/:id`

### 菜单导入导出

#### 导入功能
- 支持 Excel 文件格式 (.xlsx, .xls)
- 文件大小限制：最大 10MB
- 自动验证文件格式
- 显示导入结果详情（成功/失败数量和具体错误信息）

#### 导出功能
- 导出格式：Excel (.xlsx)
- 支持按菜单名称筛选导出
- 自动生成带时间戳的文件名
- 支持导出所有菜单或筛选后的菜单

#### Excel 导入格式要求
导入的Excel文件应包含以下列（列名必须完全匹配）：

| 列名 | 说明 | 是否必填 | 示例值 |
|------|------|----------|--------|
| 菜单名称 | 菜单显示名称 | 是 | 系统管理 |
| 菜单类型 | 菜单类型 | 是 | 目录、菜单、按钮 |
| 排序 | 显示顺序 | 否 | 1 |
| 权限标识 | 权限标识符 | 否 | system:menu:list |
| 路由地址 | 前端路由地址 | 否 | /system/menu |
| 组件路径 | 前端组件路径 | 否 | system/menu/index |
| 图标 | 菜单图标 | 否 | menu |
| 状态 | 启用状态 | 否 | 启用、禁用 |
| 备注 | 备注信息 | 否 | 系统菜单管理 |

### 状态管理
组件内部状态结构：
```typescript
interface ComponentState {
  permissionList: InterfacePermission[];  // 权限列表
  editingId: string | null;              // 当前编辑的ID
  editForm: {                            // 编辑表单数据
    id: string;
    code: string;
    remark: string;
  };
  nextId: number;                        // 下一个可用ID
  errors: {                              // 验证错误
    code?: string;
    remark?: string;
  };
}
```

## 注意事项

1. **菜单ID**: 组件需要传入有效的 `menu` 对象，包含 `id` 字段
2. **权限验证**: 确保用户有相应的操作权限
3. **错误处理**: 网络错误会自动显示错误提示
4. **数据同步**: 操作成功后会自动刷新数据列表
5. **文件格式**: 导入只支持Excel格式，不支持CSV或其他格式
6. **文件大小**: 导入文件不能超过10MB，避免性能问题

## 后续扩展

1. **分页支持**: 可以添加分页功能，支持大量数据
2. **搜索过滤**: 可以添加按编码或备注搜索功能
3. **批量操作**: 可以添加批量删除等批量操作
4. **权限控制**: 可以添加更细粒度的权限控制
5. **导入模板**: 可以提供标准的Excel导入模板下载
6. **导入预览**: 可以在导入前预览Excel内容，确认无误后再导入
7. **错误导出**: 可以将导入失败的数据导出为Excel，方便用户修正后重新导入
