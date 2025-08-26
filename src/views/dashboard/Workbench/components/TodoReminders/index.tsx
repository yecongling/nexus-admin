import type React from 'react';
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

  // 根据类型和优先级获取背景样式
  const getBackgroundStyle = (type: string, priority: string) => {
    // 高优先级使用更深的背景色
    if (priority === 'high') {
      switch (type) {
        case 'error':
          return 'bg-gradient-to-r from-red-50 to-red-100 border-red-200 hover:border-red-300';
        case 'warning':
          return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 hover:border-orange-300';
        case 'info':
          return 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 hover:border-blue-300';
        default:
          return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 hover:border-gray-300';
      }
    }
    
    // 中优先级使用中等深度的背景色
    if (priority === 'medium') {
      switch (type) {
        case 'error':
          return 'bg-gradient-to-r from-red-25 to-red-75 border-red-150 hover:border-red-250';
        case 'warning':
          return 'bg-gradient-to-r from-orange-25 to-orange-75 border-orange-150 hover:border-orange-250';
        case 'info':
          return 'bg-gradient-to-r from-blue-25 to-blue-75 border-blue-150 hover:border-blue-250';
        default:
          return 'bg-gradient-to-r from-gray-25 to-gray-75 border-gray-150 hover:border-gray-250';
      }
    }
    
    // 低优先级使用最浅的背景色
    switch (type) {
      case 'error':
        return 'bg-gradient-to-r from-red-25 to-red-50 border-red-100 hover:border-red-200';
      case 'warning':
        return 'bg-gradient-to-r from-orange-25 to-orange-50 border-orange-100 hover:border-orange-200';
      case 'info':
        return 'bg-gradient-to-r from-blue-25 to-blue-50 border-blue-100 hover:border-blue-200';
      default:
        return 'bg-gradient-to-r from-gray-25 to-gray-50 border-gray-100 hover:border-gray-200';
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
          className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${getBackgroundStyle(item.type, item.priority)}`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-white/60 backdrop-blur-sm">
                {getIcon(item.type)}
              </div>
              <span className="ml-3 font-semibold text-gray-800 text-sm">{item.title}</span>
            </div>
            <Tag 
              color={getPriorityColor(item.priority)}
              className="font-medium shadow-sm"
            >
              {item.priority === 'high' ? '高' : item.priority === 'medium' ? '中' : '低'}
            </Tag>
          </div>
          <div className="text-sm text-gray-700 mb-3 leading-relaxed">{item.description}</div>
          <div className="text-xs text-gray-500 flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-current mr-2 opacity-60"></span>
            {item.time}
          </div>
        </div>
      ))}
    </div>
  );
};
