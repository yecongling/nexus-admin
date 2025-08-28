# KeepAlive 组件

一个支持页面缓存的 React 组件，用于在标签页切换时保持页面状态和滚动位置。

## 功能特性

- ✅ 支持页面缓存，切换标签页时保持页面状态
- ✅ 自动保存和恢复页面滚动位置
- ✅ 当用户关闭标签页时，自动清除对应的缓存数据
- ✅ 当系统刷新时，自动清除所有缓存
- ✅ 支持手动清除指定页面或所有页面的缓存
- ✅ 内存管理优化，避免内存泄漏

## 使用方法

### 基本用法

```tsx
import KeepAlive from '@/components/KeepAlive';

function App() {
  return (
    <KeepAlive>
      <Outlet />
    </KeepAlive>
  );
}
```

### 手动清除缓存

组件会在 `window` 对象上暴露两个方法，方便外部调用：

```tsx
// 清除指定页面的缓存
(window as any).__keepAliveClearCache('page-key');

// 清除所有缓存
(window as any).__keepAliveClearAllCache();
```

## 工作原理

1. **缓存机制**: 使用 `Map` 数据结构存储页面组件和滚动位置
2. **自动清理**: 监听标签页变化，自动清理已关闭页面的缓存
3. **系统刷新检测**: 监听 `beforeunload`、`visibilitychange` 和 `blur` 事件
4. **滚动位置管理**: 自动保存和恢复每个页面的滚动位置

## 事件监听

组件会自动监听以下事件来管理缓存：

- `beforeunload`: 页面刷新或关闭时清除所有缓存
- `visibilitychange`: 页面隐藏时清除所有缓存
- `blur`: 页面失去焦点时清除所有缓存

## 注意事项

1. 组件依赖于 `useTabStore` 来获取标签页信息
2. 缓存的组件会在标签页关闭时自动清理
3. 系统刷新时会自动清除所有缓存，确保内存安全
4. 滚动位置的保存和恢复使用 `setTimeout` 确保 DOM 更新完成

## 性能优化

- 使用 `useCallback` 优化函数引用
- 使用 `useRef` 避免不必要的重渲染
- 自动清理无效缓存，避免内存泄漏
- 智能的滚动位置管理，提升用户体验
