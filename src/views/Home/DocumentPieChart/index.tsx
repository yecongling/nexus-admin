import { useEffect, useRef } from 'react';
import echarts from '@/config/echartsConfig';

const DocumentPieChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    chartInstance.current = echarts.init(chartRef.current, null, {
      renderer: 'canvas',
    });

    const option = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        left: 'center',
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          padAngle: 5,
          itemStyle: {
            borderRadius: 10,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' },
          ],
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
export default DocumentPieChart;
