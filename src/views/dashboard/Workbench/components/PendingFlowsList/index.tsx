import type React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Tag, Button, Avatar, type TableProps } from 'antd';
import { UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { PendingFlow } from '../../mockData';

// 模拟获取等待处理流程数据的API
const fetchPendingFlowsData = async (): Promise<PendingFlow[]> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: '1',
      name: '财务审批流程',
      waitingTime: '30分钟',
      priority: 'high',
      assignee: '张经理'
    },
    {
      id: '2',
      name: '人事变动申请',
      waitingTime: '2小时',
      priority: 'medium',
      assignee: '李主管'
    },
    {
      id: '3',
      name: '设备采购申请',
      waitingTime: '1天',
      priority: 'low',
      assignee: '王总监'
    }
  ];
};

export const PendingFlowsList: React.FC = () => {
  const { data: pendingFlows, isLoading } = useQuery({
    queryKey: ['pendingFlowsData'],
    queryFn: fetchPendingFlowsData,
    staleTime: 5 * 60 * 1000, // 5分钟
  });

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

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
      default:
        return '未知';
    }
  };

  const columns:TableProps['columns'] = [
    {
      title: '流程名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <span className="font-medium text-gray-800">{name}</span>
      ),
    },
    {
      title: '等待时间',
      dataIndex: 'waitingTime',
      key: 'waitingTime',
      render: (waitingTime: string) => (
        <div className="flex items-center">
          <ClockCircleOutlined className="text-orange-500 mr-2" />
          <span className="text-orange-600 text-sm">{waitingTime}</span>
        </div>
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>
          {getPriorityText(priority)}
        </Tag>
      ),
    },
    {
      title: '处理人',
      dataIndex: 'assignee',
      key: 'assignee',
      render: (assignee?: string) => (
        <div className="flex items-center">
          <Avatar size="small" icon={<UserOutlined />} className="mr-2!" />
          <span className="text-gray-700">{assignee || '未分配'}</span>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_: any, record: any) => (
        <Button 
          type="primary" 
          size="small"
        >
          处理
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((index) => (
          <div key={index} className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!pendingFlows || pendingFlows.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        暂无等待处理的流程
      </div>
    );
  }

  return (
    <Table
      columns={columns}
      dataSource={pendingFlows}
      pagination={false}
      rowKey="id"
      size="small"
      className="custom-table"
      loading={isLoading}
    />
  );
};
