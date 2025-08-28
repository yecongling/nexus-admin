import type React from 'react';
import { useRef, useEffect, useState, useCallback } from 'react';
import { useTabStore } from '@/stores/tabStore';

interface KeepAliveProps {
  children: React.ReactNode;
}

interface CacheItem {
  component: React.ReactElement;
  scrollTop: number;
  scrollLeft: number;
}

const KeepAlive: React.FC<KeepAliveProps> = ({ children }) => {
  const { tabs, activeKey } = useTabStore();
  const cacheRef = useRef<Map<string, CacheItem>>(new Map());
  const [currentComponent, setCurrentComponent] = useState<React.ReactElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 保存当前页面的滚动位置
  const saveScrollPosition = (key: string) => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const scrollLeft = containerRef.current.scrollLeft;
      
      const cached = cacheRef.current.get(key);
      if (cached) {
        cached.scrollTop = scrollTop;
        cached.scrollLeft = scrollLeft;
      }
    }
  };

  // 恢复页面的滚动位置
  const restoreScrollPosition = (key: string) => {
    const cached = cacheRef.current.get(key);
    if (cached && containerRef.current) {
      // 使用setTimeout确保DOM更新后再设置滚动位置
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = cached.scrollTop;
          containerRef.current.scrollLeft = cached.scrollLeft;
        }
      }, 0);
    }
  };

  // 清除指定key的缓存
  const clearCache = useCallback((key: string) => {
    if (cacheRef.current.has(key)) {
      cacheRef.current.delete(key);
    }
  }, []);

  // 清除所有缓存
  const clearAllCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  useEffect(() => {
    if (!activeKey) return;

    // 保存之前页面的滚动位置
    const previousActiveKey = Object.keys(cacheRef.current).find(key => key !== activeKey);
    if (previousActiveKey) {
      saveScrollPosition(previousActiveKey);
    }

    // 检查缓存中是否已有当前页面
    let cached = cacheRef.current.get(activeKey);
    
    if (!cached) {
      // 如果没有缓存，创建新的缓存项
      cached = {
        component: children as React.ReactElement,
        scrollTop: 0,
        scrollLeft: 0
      };
      cacheRef.current.set(activeKey, cached);
    }

    // 设置当前显示的组件
    setCurrentComponent(cached.component);

    // 恢复滚动位置
    restoreScrollPosition(activeKey);

  }, [activeKey, children]);

  // 监听系统刷新事件
  useEffect(() => {
    const handleBeforeUnload = () => {
      clearAllCache();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // 页面即将被隐藏时清除缓存
        clearAllCache();
      }
    };

    // 监听页面刷新/关闭
    window.addEventListener('beforeunload', handleBeforeUnload);
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', handleVisibilityChange);
    // 监听页面焦点变化
    window.addEventListener('blur', clearAllCache);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', clearAllCache);
    };
  }, [clearAllCache]);

  // 清理不存在的tab对应的缓存
  useEffect(() => {
    const tabKeys = tabs.map(tab => tab.key);
    const cacheKeys = Array.from(cacheRef.current.keys());
    
    cacheKeys.forEach(key => {
      if (!tabKeys.includes(key)) {
        // 当tab被关闭时，清除对应的缓存
        clearCache(key);
      }
    });
  }, [tabs, clearCache]);

  // 暴露清除缓存的方法给外部使用
  useEffect(() => {
    // 将清除缓存的方法挂载到 window 对象上，方便调试和外部调用
    (window as any).__keepAliveClearCache = clearCache;
    (window as any).__keepAliveClearAllCache = clearAllCache;
    
    return () => {
      delete (window as any).__keepAliveClearCache;
      delete (window as any).__keepAliveClearAllCache;
    };
  }, [clearCache, clearAllCache]);

  if (!currentComponent) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className="keep-alive-container"
      style={{ 
        height: '100%', 
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {currentComponent}
    </div>
  );
};

export default KeepAlive;
