# 系统参数管理模块

## 功能概述

系统参数管理模块是一个完整的参数配置管理解决方案，支持参数的增删改查、批量操作、状态管理等核心功能。

## 主要特性

- 🔍 **智能搜索**: 支持按参数名称、键值、分类进行搜索，搜索条件可折叠
- 📊 **数据表格**: 响应式表格设计，支持多选、排序、分页
- ➕ **参数管理**: 新增、编辑、删除参数，支持批量操作
- 🏷️ **分类管理**: 支持参数分类管理，便于参数组织
- 📱 **响应式设计**: 支持移动端和桌面端，布局自适应
- 🎨 **美观界面**: 基于Ant Design和Tailwind CSS的现代化UI设计

## 组件结构

```
src/views/system/Params/
├── components/           # 组件目录
│   ├── SearchForm.tsx   # 搜索表单组件（可折叠）
│   ├── TableActionButtons.tsx # 表格操作按钮
│   ├── ParamTable.tsx   # 参数表格组件（集成分页功能）
│   ├── ParamModal.tsx   # 新增/编辑弹窗
│   └── index.ts         # 组件导出文件
├── api.ts               # API服务接口
├── types.ts             # 类型定义
├── styles/              # 样式文件
│   └── params.module.scss
├── index.tsx            # 主页面组件
└── README.md            # 说明文档
```

## 技术栈

- **React 19**: 使用最新的React特性
- **Ant Design**: UI组件库
- **Tailwind CSS**: 原子化CSS框架
- **TypeScript**: 类型安全
- **React Query**: 数据获取和缓存
- **SCSS**: 样式预处理

## 使用方法

### 1. 基本使用

```tsx
import Params from '@/views/system/Params';

// 在路由中使用
<Route path="/system/params" element={<Params />} />
```

### 2. 自定义配置

```tsx
// 修改参数分类选项
import { CATEGORY_OPTIONS } from './types';

const customCategories = [
  { label: '自定义分类', value: 'CUSTOM' },
  ...CATEGORY_OPTIONS
];
```

### 3. API接口配置

```tsx
// 在 api.ts 中配置后端接口地址
export const sysParamService = {
  queryParams: (params) => request.get('/your-api/params', { params }),
  // ... 其他接口
};
```

## 数据库表结构

```sql
CREATE TABLE public.t_sys_param (
    id bigint NOT NULL,
    category character varying(32) NOT NULL,
    category_name character varying(255) NOT NULL,
    code character varying(32) NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    data_type character varying(32) NOT NULL,
    default_value character varying(255),
    value character varying(255),
    validatation_rule character varying(255),
    required boolean DEFAULT false NOT NULL,
    related_param character varying(255),
    status smallint NOT NULL,
    del_flag boolean DEFAULT false NOT NULL,
    create_by bigint NOT NULL,
    create_time timestamp with time zone DEFAULT now() NOT NULL,
    update_by bigint NOT NULL,
    update_time timestamp with time zone DEFAULT now() NOT NULL
);
```

## 功能说明

### 搜索功能
- 支持按参数名称、键值、分类进行模糊搜索
- 支持高级搜索条件（数据类型、是否必填、状态、参数描述）
- 搜索条件可折叠，使用Tailwind CSS实现平滑动画效果
- 展开/收起操作按钮位于搜索表单的操作按钮区域
- 支持重置搜索条件

### 表格功能
- 支持多选操作
- 支持状态快速切换
- 响应式列宽设计
- 支持横向滚动

### 参数管理
- 新增参数：支持完整的参数信息录入
- 编辑参数：支持参数信息修改
- 删除参数：支持单个和批量删除
- 状态管理：支持启用/禁用状态切换

### 分页功能
- 分页功能集成在表格中，支持页码跳转
- 支持每页条数设置
- 显示总记录数和当前页范围
- 支持快速跳转和每页条数选择器

## 样式定制

### 主题色彩
- 主色调：红色系 (#ef4444)
- 辅助色：蓝色系 (#3b82f6)
- 成功色：绿色系 (#10b981)
- 警告色：黄色系 (#f59e0b)

### 响应式断点
- 移动端：< 768px
- 平板端：768px - 1024px
- 桌面端：> 1024px

## 性能优化

- 使用 React.memo 优化组件渲染
- 使用 useCallback 和 useMemo 优化函数和计算
- 支持虚拟滚动（大数据量场景）
- 图片懒加载和代码分割

## 扩展性

### 添加新字段
1. 在 `types.ts` 中添加字段定义
2. 在 `ParamModal.tsx` 中添加表单控件
3. 在 `ParamTable.tsx` 中添加表格列
4. 在 API 接口中添加字段处理

### 添加新功能
1. 在 `components/` 目录下创建新组件
2. 在主页面中集成新组件
3. 添加相应的状态管理和事件处理

## 注意事项

1. **权限控制**: 确保用户有相应的操作权限
2. **数据验证**: 前端验证和后端验证相结合
3. **错误处理**: 完善的错误提示和异常处理
4. **性能监控**: 监控组件渲染和数据加载性能

## 更新日志

### v1.0.0 (2024-01-XX)
- 初始版本发布
- 支持基本的CRUD操作
- 响应式设计
- 完整的类型定义

## 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个模块。

## 许可证

MIT License
