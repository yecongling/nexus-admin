# 应用模板创建弹窗组件

这是一个完整的应用模板创建弹窗组件，实现了从应用模板创建应用的功能。

## 功能特性

- 🎯 **分类导航**: 左侧显示模板分类，支持推荐、AI编程、知识检索等分类
- 🔍 **智能搜索**: 支持关键词搜索，可搜索模板名称、描述和标签
- 🏷️ **类型筛选**: 支持按工作流、Chatflow、聊天助手、Agent、文本生成等类型筛选
- 📱 **响应式设计**: 使用Tailwind CSS实现响应式布局
- ⚡ **性能优化**: 使用React Query进行数据管理和缓存
- 🎨 **美观UI**: 基于Ant Design组件库，结合Tailwind CSS样式

## 组件结构

```
create-app-template/
├── components/           # 子组件
│   ├── CategorySidebar.tsx    # 左侧分类导航
│   ├── TemplateCard.tsx       # 模板卡片
│   ├── TemplateGrid.tsx       # 模板网格展示
│   └── TemplateTypeDropdown.tsx # 类型筛选下拉
├── services.ts          # 模拟API服务
├── mockData.ts         # 模拟数据
├── types.ts            # 类型定义
├── styles.css          # 样式文件
├── index.tsx           # 主组件
└── README.md           # 说明文档
```

## 使用方法

### 1. 基本使用

```tsx
import AppTemplates from './create-app-template';

const MyComponent = () => {
  const [open, setOpen] = useState(false);

  const handleCreateFromBlank = () => {
    console.log('创建空白应用');
  };

  return (
    <AppTemplates
      open={open}
      onClose={() => setOpen(false)}
      onCreateFromBlank={handleCreateFromBlank}
    />
  );
};
```

### 2. 自定义样式

组件使用Tailwind CSS类名，可以通过修改`styles.css`文件来自定义样式。

### 3. 数据源配置

目前使用模拟数据，可以通过修改`services.ts`文件来集成真实的API接口。

## 数据模型

### AppTemplate (应用模板)

```typescript
interface AppTemplate {
  id: string;                    // 模板ID
  name: string;                  // 模板名称
  type: TemplateType;            // 模板类型
  description: string;           // 模板描述
  icon: string;                  // 模板图标
  iconBg?: string;               // 图标背景色
  category: string;              // 所属分类
  tags: string[];                // 标签列表
  createTime: string;            // 创建时间
  updateTime: string;            // 更新时间
  usageCount: number;            // 使用次数
  rating: number;                // 评分
}
```

### TemplateCategory (模板分类)

```typescript
interface TemplateCategory {
  id: string;                    // 分类ID
  name: string;                  // 分类名称
  icon: string;                  // 分类图标
  count: number;                 // 模板数量
  isRecommended?: boolean;       // 是否推荐
}
```

## 技术栈

- **React 19**: 使用最新的React特性
- **TypeScript**: 完整的类型支持
- **Ant Design**: UI组件库
- **Tailwind CSS**: 原子化CSS框架
- **React Query**: 数据获取和缓存
- **Zustand**: 状态管理

## 开发说明

### 1. 添加新的模板类型

在`types.ts`中的`TemplateType`联合类型中添加新类型：

```typescript
export type TemplateType = 
  | 'workflow' 
  | 'chatflow' 
  | 'chat_assistant' 
  | 'agent' 
  | 'text_generation'
  | 'new_type'; // 新增类型
```

### 2. 添加新的分类

在`mockData.ts`中的`mockCategories`数组中添加新分类：

```typescript
{
  id: 'new_category',
  name: '新分类',
  icon: '🆕',
  count: 0,
}
```

### 3. 集成真实API

修改`services.ts`文件，将模拟API替换为真实的API调用：

```typescript
export const templateService = {
  async getCategories(): Promise<TemplateCategory[]> {
    const response = await fetch('/api/templates/categories');
    return response.json();
  },
  // ... 其他方法
};
```

## 注意事项

1. 组件依赖Tailwind CSS，确保项目中已正确配置
2. 使用React Query进行数据管理，确保QueryClient已配置
3. 组件使用模拟数据，生产环境需要替换为真实API
4. 样式文件包含自定义CSS，确保正确引入

## 更新日志

- **v1.0.0**: 初始版本，包含完整的模板创建功能
- 支持分类导航、搜索筛选、模板展示等核心功能
- 使用React Query进行数据管理
- 响应式设计，支持多种屏幕尺寸
