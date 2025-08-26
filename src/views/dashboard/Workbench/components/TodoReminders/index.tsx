import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tag } from 'antd';
import { WarningOutlined, ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { TodoReminder } from '../../mockData';

// 模拟获取待办提醒数据的API
const fetchTodoRemindersData = async (): Promise<TodoReminder[]> => {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 300));

  return [
    {
      id: '1',
      type: 'warning',
      title: '流程执行异常',
      description: '用户数据同步流程出现超时错误',
      time: '2分钟前',
      priority: 'high',
    },
    {
      id: '2',
      type: 'error',
      title: '系统资源不足',
      description: '服务器CPU使用率超过90%',
      time: '5分钟前',
      priority: 'high',
    },
    {
      id: '3',
      type: 'info',
      title: '新流程待审核',
      description: '3个新流程等待管理员审核',
      time: '10分钟前',
      priority: 'medium',
    },
  ];
};

export const TodoReminders: React.FC = () => {
  const { data: todoReminders, isLoading } = useQuery({
    queryKey: ['todoRemindersData'],
    queryFn: fetchTodoRemindersData,
    staleTime: 5 * 60 * 1000, // 5分钟
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <WarningOutlined className="text-orange-500" />;
      case 'error':
        return <ExclamationCircleOutlined className="text-red-500" />;
      case 'info':
        return <InfoCircleOutlined className="text-blue-500" />;
      default:
        return <InfoCircleOutlined className="text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'blue';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((index) => (
          <div key={index} className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!todoReminders || todoReminders.length === 0) {
    return <div className="text-center py-8 text-gray-500">暂无待办提醒</div>;
  }

  return (
    <div className="space-y-3">
      {todoReminders.map((item) => (
        <div
          key={item.id}
          className="p-3 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors duration-200"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center">
              {getIcon(item.type)}
              <span className="ml-2 font-medium text-gray-800 text-sm">{item.title}</span>
            </div>
            <Tag color={getPriorityColor(item.priority)}>
              {item.priority === 'high' ? '高' : item.priority === 'medium' ? '中' : '低'}
            </Tag>
          </div>
          <div className="text-xs text-gray-600 mb-2">{item.description}</div>
          <div className="text-xs text-gray-400">{item.time}</div>
        </div>
      ))}
    </div>
  );
};
