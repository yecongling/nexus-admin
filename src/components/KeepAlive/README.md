# KeepAlive 组件

一个支持页面缓存的 React 组件，用于在标签页切换时保持页面状态和滚动位置。

## 功能特性

- ✅ **智能缓存策略**: 根据菜单配置的 `keepalive` 字段决定是否缓存页面
- ✅ 支持页面缓存，切换标签页时保持页面状态
- ✅ 自动保存和恢复页面滚动位置
- ✅ 当用户关闭标签页时，自动清除对应的缓存数据
- ✅ 当系统刷新时，自动清除所有缓存
- ✅ 支持手动清除指定页面或所有页面的缓存
- ✅ 内存管理优化，避免内存泄漏
- ✅ 只缓存配置了 `keepalive: true` 的页面

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

### 菜单配置

在菜单管理中，为需要缓存的页面设置 `keepalive: true`：

```typescript
// 菜单配置示例
{
  path: '/dashboard',
  component: 'dashboard/Index',
  meta: {
    title: '仪表盘',
    keepAlive: true  // 设置为 true 才会被缓存
  }
}
```

### 手动清除缓存

组件会在 `window` 对象上暴露三个方法，方便外部调用：

```tsx
// 清除指定页面的缓存
(window as any).__keepAliveClearCache('page-key');

// 清除所有缓存
(window as any).__keepAliveClearAllCache();

// 智能清理缓存（清理最久未使用的缓存）
(window as any).__keepAliveSmartClearCache();
```

## 工作原理

1. **智能缓存判断**: 检查当前页面对应的菜单配置中 `keepalive` 是否为 `true`
2. **缓存机制**: 只有配置了 `keepalive: true` 的页面才会被缓存
3. **自动清理**: 监听标签页变化，自动清理已关闭页面的缓存
4. **系统刷新检测**: 监听 `beforeunload` 事件，页面刷新时清除所有缓存
5. **滚动位置管理**: 自动保存和恢复每个页面的滚动位置

## 缓存策略

- **配置了 `keepalive: true` 的页面**: 会被缓存，切换标签页时保持状态
- **配置了 `keepalive: false` 或未配置的页面**: 不会被缓存，每次切换都重新渲染
- **智能缓存清理**: 当缓存数量超过限制时，优先保留最近使用的 keepalive 页面

## 事件监听

组件会自动监听以下事件来管理缓存：

- `beforeunload`: 页面刷新或关闭时清除所有缓存

## 注意事项

1. 组件依赖于 `useTabStore` 来获取标签页信息和菜单配置
2. 只有配置了 `keepalive: true` 的页面才会被缓存
3. 缓存的组件会在标签页关闭时自动清理
4. 系统刷新时会自动清除所有缓存，确保内存安全
5. 滚动位置的保存和恢复使用 `setTimeout` 确保 DOM 更新完成

## 性能优化

- 使用 `useCallback` 优化函数引用
- 使用 `useRef` 避免不必要的重渲染
- 自动清理无效缓存，避免内存泄漏
- 智能的滚动位置管理，提升用户体验
- 只缓存必要的页面，减少内存占用
