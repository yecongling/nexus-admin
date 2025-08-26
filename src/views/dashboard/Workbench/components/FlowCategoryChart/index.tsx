import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import echarts from '@/config/echartsConfig';
import type { CategoryData } from '../../mockData';
import { getFlowCategoryChartOption, getResponsiveChartOption } from '../chartConfigs';

// 模拟获取类别数据的API
const fetchCategoryData = async (): Promise<CategoryData> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    categories: ['成功流程', '失败流程', '等待中流程'],
    values: [48, 36, 16],
    total: 928531,
    colors: ['#52c41a', '#ff4d4f', '#faad14']
  };
};

export const FlowCategoryChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [chartData, setChartData] = useState<CategoryData | null>(null);

  const { data: categoryData, isLoading } = useQuery({
    queryKey: ['flowCategoryData'],
    queryFn: fetchCategoryData,
    staleTime: 5 * 60 * 1000, // 5分钟
  });

  useEffect(() => {
    if (categoryData) {
      setChartData(categoryData);
    }
  }, [categoryData]);

  useEffect(() => {
    if (!chartRef.current || !chartData) return;

    // 初始化图表
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // 使用配置工具生成图表选项
    const baseOption = getFlowCategoryChartOption(chartData);
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
      <div className="flex items-center justify-center h-48">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-gray-500">暂无数据</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-4">
        <div className="text-2xl font-bold text-gray-800">
          {chartData.total.toLocaleString()}
        </div>
        <div className="text-sm text-gray-500">总流程量</div>
      </div>
      
      <div ref={chartRef} className="w-full h-48" />
      
      {/* 图例 */}
      <div className="mt-4 space-y-2">
        {chartData.categories.map((category, index) => (
          <div key={`legend-${category}`} className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: chartData.colors[index] }}
              ></div>
              <span className="text-sm text-gray-700">{category}</span>
            </div>
            <span className="text-sm font-medium text-gray-800">
              {chartData.values[index].toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
