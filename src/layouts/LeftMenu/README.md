# LeftMenu 组件

左侧菜单组件，支持与TabBar组件的双向同步。

## 功能特性

- ✅ 响应式菜单布局
- ✅ 支持多级菜单
- ✅ 自动展开/折叠
- ✅ 主题切换支持
- ✅ **新增：与TabBar同步**
  - 点击菜单时自动添加/激活对应标签页
  - 切换标签页时自动更新菜单选中状态
  - 保持菜单展开状态同步

## 同步机制

### 1. 菜单 → 标签页同步
当用户点击左侧菜单时：
- 自动跳转到对应页面
- TabBar组件检测到路径变化
- 自动添加或激活对应标签页

### 2. 标签页 → 菜单同步
当用户切换标签页时：
- 左侧菜单自动更新选中状态
- 自动展开对应的父级菜单
- 保持视觉状态一致

## 技术实现

### 状态管理
- 使用`selectedKeys`状态控制菜单选中项
- 监听`activeKey`变化来同步更新
- 支持`openKeys`状态管理菜单展开

### 关键代码
```typescript
// 监听tab切换，同步更新左侧菜单选中状态
useEffect(() => {
  if (activeKey && activeKey !== pathname) {
    setSelectedKeys([activeKey]);
    // 同时更新openKeys，确保父级菜单展开
    const openKey = getOpenKeys(activeKey);
    !collapsed && setOpenKeys(openKey);
  }
}, [activeKey, pathname, collapsed]);
```

## 使用说明

### 基本使用
```tsx
import MenuComponent from '@/layouts/LeftMenu/component/MenuComponent';

// 在LeftMenu组件中使用
<MenuComponent />
```

### 配置选项
- `accordion`: 是否启用手风琴模式（一次只能展开一个菜单）
- `dynamicTitle`: 是否动态更新页面标题
- `collapsed`: 菜单是否折叠状态

## 依赖关系

- **TabBar组件**: 提供`activeKey`状态
- **路由系统**: 提供当前路径信息
- **菜单配置**: 从store获取菜单数据
- **主题系统**: 支持亮色/暗色主题切换

## 注意事项

1. 菜单选中状态会自动与当前激活的标签页同步
2. 父级菜单会自动展开以显示当前选中的子菜单
3. 支持键盘导航和触摸操作
4. 响应式设计，支持不同屏幕尺寸

## 样式定制

菜单组件使用Ant Design的Menu组件，支持以下样式定制：
- 主题色彩
- 字体大小
- 间距调整
- 图标样式

## 国际化支持

菜单标题支持多语言配置，通过`useTranslation` hook实现。
