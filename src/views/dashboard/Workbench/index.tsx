import { useQuery } from '@tanstack/react-query';
import { Row, Col, Card, Typography } from 'antd';
import type React from 'react';
import {
  StatisticCards,
  FlowTrendChart,
  HotFlowsTable,
  QuickAccess,
  RecentVisits,
  Announcements,
  HelpDocuments,
  FlowCategoryChart,
  TodoReminders,
  FailedFlowsList,
  PendingFlowsList
} from './components';
import { mockWorkbenchData } from './mockData';
import styles from './Workbench.module.scss';
import { useUserStore } from '@/stores/userStore';

const { Title } = Typography;

/**
 * 工作台
 * @returns 工作台组件
 */
const Workbench: React.FC = () => {

  const { loginUser } = useUserStore();

  const { data: workbenchData, isLoading } = useQuery({
    queryKey: ['workbench'],
    queryFn: mockWorkbenchData,
    staleTime: 5 * 60 * 1000, // 5分钟
  });

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 bg-gray-50 min-h-screen ${styles.workbench}`}>
      {/* 欢迎信息 */}
      <div className="mb-6">
        <Title level={2} className="text-gray-800">
          欢迎回来, {loginUser}
        </Title>
      </div>

      {/* 统计卡片 */}
      <StatisticCards />

      <Row gutter={[24, 24]} className="mt-6">
        {/* 左侧主要内容区域 */}
        <Col xs={24} lg={16}>
          {/* 流程运行时间趋势图 */}
          <Card 
            title="流程运行时间趋势图 (近7日)" 
            className="mb-6"
            styles={{
              header: {
                borderBottom: 'none',
              }
            }}
          >
            <FlowTrendChart />
          </Card>

          {/* 热门流程 TOP5 */}
          <Card title="热门流程 TOP5" className="mb-6">
            <HotFlowsTable />
          </Card>

          {/* 失败流程列表 */}
          <Card title="失败流程列表" className="mb-6">
            <FailedFlowsList />
          </Card>

          {/* 等待人工处理的流程 */}
          <Card title="等待人工处理的流程" className="mb-6">
            <PendingFlowsList />
          </Card>
        </Col>

        {/* 右侧边栏 */}
        <Col xs={24} lg={8}>
          {/* 快捷入口 */}
          <Card title="快捷入口" className="mb-6" extra={<a href="/workflow/manage">管理</a>}>
            <QuickAccess />
          </Card>

          {/* 最近访问 */}
          <Card title="最近访问" className="mb-6">
            <RecentVisits />
          </Card>

          {/* 待办提醒 / 异常警报 */}
          <Card title="待办提醒 / 异常警报" className="mb-6">
            <TodoReminders />
          </Card>

          {/* 公告 */}
          <Card title="公告" className="mb-6" extra={<a href="/announcements">查看更多</a>}>
            <Announcements />
          </Card>

          {/* 帮助文档 */}
          <Card title="帮助文档" className="mb-6" extra={<a href="/help">查看更多</a>}>
            <HelpDocuments />
          </Card>

          {/* 流程类别占比 */}
          <Card title="流程类别占比" className="mb-6">
            <FlowCategoryChart />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Workbench;
