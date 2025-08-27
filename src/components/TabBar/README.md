# TabBar 组件

一个支持 keepalive 的标签页组件，基于 Ant Design 的 Tabs 组件实现。

## 功能特性

- ✅ 支持 keepalive 页面缓存
- ✅ 自动根据路由变化添加/激活标签页
- ✅ 右键菜单支持多种操作
- ✅ 标签页固定/取消固定
- ✅ 批量关闭标签页
- ✅ 页面刷新后保持标签页状态
- ✅ 左侧菜单与标签页联动
- ✅ 响应式设计
- ✅ **新增：右侧功能区域**
  - 下拉菜单（与右键菜单功能一致）
  - 全屏切换功能

## 使用方法

### 1. 在 Header 中添加 TabBar

```tsx
import TabBar from '@/components/TabBar';

// 在 Header 组件中添加
<HeaderMenu />
<TabBar />
<Space size="large" className="flex justify-end items-center toolbox">
```

### 2. 在 Content 中添加 KeepAlive

```tsx
import KeepAlive from '@/components/KeepAlive';

// 在 Content 组件中包装 Outlet
<KeepAlive>
  <Outlet />
</KeepAlive>
```

## 功能区域

### 标签页区域
- 支持右键菜单操作
- 自动管理标签页的添加/删除
- 当只有一个标签页时不显示关闭按钮

### 右侧功能区域
- **下拉菜单按钮** (⬇️): 点击显示操作菜单
- **全屏按钮** (⛶): 切换页面全屏状态

## 右键菜单功能

每个标签页都支持右键菜单，包含以下操作：

- **关闭**: 关闭当前标签页
- **固定/取消固定**: 固定标签页（不可关闭）
- **最大化**: 最大化标签页（待实现）
- **重新加载**: 重新加载页面内容
- **在新窗口打开**: 在新标签页中打开
- **关闭左侧标签页**: 关闭当前标签页左侧的所有标签页
- **关闭右侧标签页**: 关闭当前标签页右侧的所有标签页
- **关闭其它标签页**: 只保留当前标签页
- **关闭全部标签页**: 关闭所有标签页

## 右侧下拉菜单

右侧下拉菜单提供与右键菜单相同的功能，但操作的是当前激活的标签页：

- 所有右键菜单功能都可以通过右侧下拉菜单访问
- 点击触发，更直观的操作方式
- 适合键盘操作和触摸设备

## 状态管理

TabBar 使用 Zustand 进行状态管理，主要状态包括：

- `tabs`: 打开的标签页列表
- `activeKey`: 当前激活的标签页
- `addTab`: 添加新标签页
- `removeTab`: 移除标签页
- `setActiveKey`: 设置激活的标签页
- `closeOtherTabs`: 关闭其他标签页
- `closeLeftTabs`: 关闭左侧标签页
- `closeRightTabs`: 关闭右侧标签页
- `closeAllTabs`: 关闭所有标签页
- `reloadTab`: 重新加载标签页
- `pinTab`: 固定标签页
- `unpinTab`: 取消固定标签页

## 样式定制

TabBar 组件使用 SCSS 进行样式定制，主要样式类：

- `.tab-bar`: 标签栏容器
- `.tab-bar-content`: 标签栏内容区域（包含标签页和右侧功能）
- `.tab-bar-tabs`: 标签页组件
- `.tab-bar-actions`: 右侧功能区域
- `.tab-action-btn`: 右侧功能按钮
- `.ant-tabs-tab`: 单个标签页
- `.ant-tabs-tab-active`: 激活状态的标签页
- `.ant-tabs-tab-remove`: 关闭按钮

## 注意事项

1. 标签页会根据路由自动添加，无需手动管理
2. 当只有一个标签页时，关闭按钮不会显示
3. 关闭当前激活的标签页时，会自动激活前一个标签页
4. 页面刷新后，标签页状态会从 localStorage 中恢复
5. 标签页内容由 KeepAlive 组件缓存，支持页面状态保持
6. 右侧下拉菜单操作的是当前激活的标签页
7. 全屏功能使用浏览器原生 API

## 国际化支持

TabBar 组件支持中英文国际化，相关文案在以下文件中配置：

- `src/locales/zh-CN/common.ts`
- `src/locales/en-US/common.ts`

## 依赖

- React 18+
- Ant Design 5+
- React Router 6+
- Zustand
- SCSS
