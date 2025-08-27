import type React from 'react';
import { useRef, useEffect, useState } from 'react';
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

  // 清理不存在的tab对应的缓存
  useEffect(() => {
    const tabKeys = tabs.map(tab => tab.key);
    const cacheKeys = Array.from(cacheRef.current.keys());
    
    cacheKeys.forEach(key => {
      if (!tabKeys.includes(key)) {
        cacheRef.current.delete(key);
      }
    });
  }, [tabs]);

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
