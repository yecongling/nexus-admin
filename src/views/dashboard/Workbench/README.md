# Workbench 工作台组件

这是一个完整的后台管理系统工作台页面，专为不同系统间进行交互集成使用而设计。

## 功能特性

### 主要功能模块

1. **流程统计看板**
   - 今日/本周运行流程数
   - 成功/失败流程统计
   - 异常流程预警
   - 待办提醒

2. **数据可视化**
   - 流程运行时间趋势图（近7日）
   - 热门流程 TOP5 排行榜
   - 流程类别占比饼图

3. **流程管理**
   - 失败流程列表（支持重试操作）
   - 等待人工处理的流程列表
   - 流程状态监控

4. **快捷功能**
   - 快捷入口（新建流程、流程模板库、流程监控等）
   - 最近访问记录
   - 系统公告
   - 帮助文档

5. **异常处理**
   - 异常流程预警
   - 待办提醒/异常警报
   - 系统通知

## 技术架构

- **前端框架**: React 18 + TypeScript
- **UI组件库**: Ant Design (antd)
- **样式框架**: Tailwind CSS
- **状态管理**: @Tanstack/react-query
- **数据模拟**: 内置mock数据

## 组件结构

```
Workbench/
├── index.tsx                 # 主组件
├── mockData.ts              # 模拟数据
├── components/              # 子组件目录
│   ├── index.ts            # 组件导出文件
│   ├── StatisticCards/     # 统计卡片
│   ├── FlowTrendChart/     # 流程趋势图
│   ├── HotFlowsTable/      # 热门流程表格
│   ├── QuickAccess/        # 快捷入口
│   ├── RecentVisits/       # 最近访问
│   ├── TodoReminders/      # 待办提醒
│   ├── Announcements/      # 公告
│   ├── HelpDocuments/      # 帮助文档
│   ├── FlowCategoryChart/  # 流程类别占比
│   ├── FailedFlowsList/    # 失败流程列表
│   └── PendingFlowsList/   # 等待处理流程列表
└── README.md               # 说明文档
```

## 使用方法

### 1. 基本使用

```tsx
import Workbench from './views/dashboard/Workbench';

function App() {
  return (
    <div>
      <Workbench />
    </div>
  );
}
```

### 2. 数据配置

组件使用 `@Tanstack/react-query` 进行数据管理，默认使用内置的模拟数据：

```tsx
// 自定义数据获取函数
const customDataFetcher = async () => {
  // 调用真实API
  const response = await fetch('/api/workbench');
  return response.json();
};

// 在组件中使用
const { data } = useQuery({
  queryKey: ['workbench'],
  queryFn: customDataFetcher,
});
```

### 3. 样式定制

组件使用 Tailwind CSS 进行样式管理，可以通过修改 className 来自定义样式：

```tsx
// 自定义卡片样式
<Card className="mb-6 custom-card">
  <StatisticCards data={data?.statistics} />
</Card>
```

## 数据接口

### WorkbenchData 接口

```typescript
interface WorkbenchData {
  userName: string;                    // 用户名
  statistics: StatisticData[];        // 统计卡片数据
  trendData: TrendData;               // 趋势图数据
  hotFlows: HotFlow[];                // 热门流程数据
  quickAccess: QuickAccessItem[];     // 快捷入口数据
  recentVisits: RecentVisit[];        // 最近访问数据
  todoReminders: TodoReminder[];      // 待办提醒数据
  announcements: Announcement[];      // 公告数据
  helpDocuments: HelpDocument[];      // 帮助文档数据
  categoryData: CategoryData;         // 类别占比数据
  failedFlows: FailedFlow[];          // 失败流程数据
  pendingFlows: PendingFlow[];        // 等待处理流程数据
}
```

## 性能优化

1. **组件拆分**: 将页面拆分为多个独立组件，提高复用性和维护性
2. **懒加载**: 使用 React.lazy 和 Suspense 实现组件懒加载
3. **数据缓存**: 使用 @Tanstack/react-query 进行数据缓存和状态管理
4. **虚拟滚动**: 对于长列表使用虚拟滚动优化性能

## 扩展功能

### 添加新的统计卡片

```tsx
// 在 mockData.ts 中添加新的统计数据
statistics: [
  // ... 现有数据
  {
    title: '新指标',
    value: '100',
    icon: React.createElement(NewIcon, { className: "text-purple-500 text-2xl" }),
    suffix: '个',
    trend: '5%',
    trendType: 'up'
  }
]
```

### 添加新的快捷入口

```tsx
// 在 mockData.ts 中添加新的快捷入口
quickAccess: [
  // ... 现有数据
  {
    icon: React.createElement(NewIcon, { className: "text-green-500" }),
    title: '新功能',
    description: '功能描述',
    link: '/new-feature'
  }
]
```

## 注意事项

1. 确保项目中已安装 `@tanstack/react-query`、`antd` 和 `tailwindcss`
2. 组件使用 TypeScript，确保类型定义正确
3. 模拟数据仅用于开发测试，生产环境需要替换为真实API
4. 样式使用 Tailwind CSS，确保项目配置正确

## 更新日志

- v1.0.0: 初始版本，包含完整的workbench功能
- 支持响应式布局
- 包含所有核心功能模块
- 使用现代化的技术栈
