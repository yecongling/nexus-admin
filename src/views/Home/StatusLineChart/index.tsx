import type React from 'react';
import { useEffect, useRef } from 'react';
import echarts from '@/config/echartsConfig';

/**
 * 状态折线图
 * @returns
 */
const StatusLineChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts>();

  useEffect(() => {
    chartInstance.current = echarts.init(chartRef.current, null, {
      renderer: 'canvas',
    });

    const option = {
      tooltip: {},
      grid: {
        left: '5%',
        right: '5%',
        bottom: '10%',
        top: '2%',
      },
      xAxis: {
        data: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar', // 柱状图
          data: [5, 20, 36, 10, 10, 20, 30],
          itemStyle: {
            color: () => {
              const color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#1677FF' }, // 渐变起点颜色 (从顶部开始)
                { offset: 1, color: '#f0fbff' }, // 渐变终点颜色 (到底部)
              ]);
              return color;
            },
          },
        },
        {
          name: '增长',
          type: 'line', // 折线图
          data: [3, 15, 22, 8, 13, 25, 32],
        },
      ],
    };

    chartInstance.current.setOption(option);

    const resizeObserver = new ResizeObserver(() => {
      chartInstance.current?.resize();
    });

    resizeObserver.observe(chartRef.current as HTMLDivElement);
    return () => {
      chartInstance.current?.dispose();
      resizeObserver.disconnect();
    };
  }, []);
  return (
    <div
      ref={chartRef}
      style={{
        height: '100%',
        width: '100%',
      }}
    />
  );
};
export default StatusLineChart;
