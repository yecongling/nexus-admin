# 流程版本管理组件

基于原型图开发的流程版本管理功能，包含版本列表、版本对比、版本创建和版本发布等功能。

## 组件结构

```
Versions/
├── index.tsx                    # 主组件，整合所有子组件
├── VersionList.tsx             # 版本列表页面
├── VersionComparison.tsx       # 版本对比页面
├── CreateVersionModal.tsx      # 创建版本弹窗
├── ReleaseConfirmation.tsx     # 版本发布确认页面
└── README.md                   # 说明文档
```

## 功能特性

### 1. 版本列表页面 (VersionList)
- 版本搜索和筛选
- 版本状态展示（草稿、已发布、已弃用、已归档）
- 版本操作按钮（查看、编辑、发布、删除、回滚、对比、下载）
- 分页功能（默认每页20条，支持10/20/50/100条切换）
- 响应式布局，支持不同屏幕尺寸

### 2. 版本对比页面 (VersionComparison)
- 选择两个版本进行对比
- 差异内容高亮显示
- 变更摘要统计
- 支持JSON格式的差异展示

### 3. 创建版本弹窗 (CreateVersionModal)
- 版本类型选择（主版本、次版本、补丁版本、热修复）
- 版本信息填写
- 基于版本选择
- 创建后立即发布选项

### 4. 版本发布确认页面 (ReleaseConfirmation)
- 版本信息确认
- 主要变更展示
- 影响评估
- 发布确认操作

## 数据模型

基于4个SQL表定义了对应的TypeScript实体类：

- `WorkflowVersion` - 流程版本主表
- `WorkflowLock` - 版本锁表
- `WorkflowBranch` - 版本分支表
- `WorkflowVersionDelta` - 版本差异表

### 分页支持

版本列表查询支持分页功能，使用 `PageResult<T>` 类型：

```typescript
interface PageResult<T> {
  pageNumber: number;    // 当前页码
  pageSize: number;      // 每页显示数量
  totalRow: number;      // 总记录数
  totalPage: number;     // 总页数
  records: T[];          // 数据列表
}
```

## 使用方式

```tsx
import Versions from '@/views/integrated/Versions';

// 在路由中使用
<Route path="/versions" component={Versions} />
```

## API接口

所有API接口已按照项目规范实现，使用HttpRequest进行调用：

### 版本管理服务 (versionsService)
- `getVersionList` - 获取版本列表
- `getVersionDetail` - 获取版本详情
- `createVersion` - 创建版本
- `publishVersion` - 发布版本
- `deleteVersion` - 删除版本
- `compareVersions` - 版本对比
- `rollbackVersion` - 回滚版本
- `downloadVersion` - 下载版本
- `getVersionLocks` - 获取版本锁信息
- `getVersionBranches` - 获取版本分支列表
- `assessVersionImpact` - 版本影响评估
- `lockVersion` - 锁定版本进行编辑
- `unlockVersion` - 释放版本锁定

### API地址规范
所有接口都遵循RESTful规范：
- GET `/api/workflows/{workflowId}/versions` - 获取版本列表
- POST `/api/workflows/{workflowId}/versions` - 创建版本
- GET `/api/workflows/{workflowId}/versions/{versionId}` - 获取版本详情
- DELETE `/api/workflows/{workflowId}/versions/{versionId}` - 删除版本
- POST `/api/workflows/{workflowId}/versions/{version}/publish` - 发布版本
- POST `/api/workflows/{workflowId}/versions/compare` - 版本对比
- POST `/api/workflows/{workflowId}/versions/rollback` - 回滚版本
- GET `/api/workflows/{workflowId}/versions/{versionId}/download` - 下载版本
- POST `/api/workflows/{workflowId}/versions/{version}/lock` - 锁定版本
- DELETE `/api/workflows/{workflowId}/versions/{version}/lock` - 释放锁定

## 样式说明

- 使用Ant Design组件库
- 遵循系统主题色彩规范
- 响应式设计，支持移动端
- 统一的交互反馈

## 待实现功能

1. 真实的API接口调用
2. 版本文件上传和下载
3. 版本权限控制
4. 版本历史记录
5. 版本标签管理
6. 版本合并功能
