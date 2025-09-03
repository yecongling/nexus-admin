import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import echarts from '@/config/echartsConfig';
import type { TrendData } from '../../mockData';
import { getFlowTrendChartOption, getResponsiveChartOption } from '../chartConfigs';

// 模拟获取趋势数据的API
const fetchTrendData = async (): Promise<TrendData> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    dates: ['03-07', '03-08', '03-09', '03-10', '03-11', '03-12', '03-13'],
    values: [12000, 19000, 15000, 25000, 39068, 28000, 22000],
    totalFlows: 39068,
    highlightDate: '03-11',
    highlightValue: 39068
  };
};

export const FlowTrendChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [chartData, setChartData] = useState<TrendData | null>(null);

  const { data: trendData, isLoading } = useQuery({
    queryKey: ['flowTrendData'],
    queryFn: fetchTrendData,
    staleTime: 5 * 60 * 1000, // 5分钟
  });

  useEffect(() => {
    if (trendData) {
      setChartData(trendData);
    }
  }, [trendData]);

  useEffect(() => {
    if (!chartRef.current || !chartData) return;

    // 初始化图表
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // 使用配置工具生成图表选项
    const baseOption = getFlowTrendChartOption(chartData);
    const isMobile = window.innerWidth < 768;
    const option = getResponsiveChartOption(baseOption, isMobile);

    // 设置图表选项
    chartInstance.current.setOption(option);

    // 响应式处理
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, [chartData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">暂无数据</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-500">
          总流程量: {chartData.totalFlows?.toLocaleString()}
        </div>
      </div>
      
      <div ref={chartRef} className="w-full h-64" />
    </div>
  );
};



