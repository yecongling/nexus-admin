import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  MonitorOutlined,
  BookOutlined,
  SettingOutlined
} from '@ant-design/icons';
import type { RecentVisit } from '../../mockData';

// 模拟获取最近访问数据的API
const fetchRecentVisitsData = async (): Promise<RecentVisit[]> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      icon: React.createElement(MonitorOutlined, { className: "text-blue-500" }),
      title: '流程监控',
      description: '实时监控页面',
      link: '/workflow/monitor'
    },
    {
      icon: React.createElement(BookOutlined, { className: "text-green-500" }),
      title: '流程模板库',
      description: '模板管理页面',
      link: '/workflow/templates'
    },
    {
      icon: React.createElement(SettingOutlined, { className: "text-orange-500" }),
      title: '节点管理',
      description: '节点配置页面',
      link: '/workflow/nodes'
    }
  ];
};

export const RecentVisits: React.FC = () => {
  const { data: recentVisits, isLoading } = useQuery({
    queryKey: ['recentVisitsData'],
    queryFn: fetchRecentVisitsData,
    staleTime: 5 * 60 * 1000, // 5分钟
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((index) => (
          <div key={index} className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!recentVisits || recentVisits.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        暂无最近访问数据
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recentVisits.map((item, index) => (
        <div
          key={`recent-${item.title}-${index}`}
          className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
        >
          <div className="text-lg mr-3">
            {item.icon}
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-800 text-sm">{item.title}</div>
            <div className="text-xs text-gray-500">{item.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
