import { createRoot } from 'react-dom/client';
import '@/styles/global.scss'; // 引入 Sass 文件
import { BrowserRouter } from 'react-router';
import GlobalConfigProvider from './GlobalConfigProvider';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './locales/i18next-config';
import '@ant-design/v5-patch-for-react-19';
import { initI18n } from './locales/i18next-config';

const container = document.getElementById('root');
if (container) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // 默认所有的useQuery请求都不重试，内部如果有需要重试的，需要手动设置retry: true
        refetchOnWindowFocus: false, // 窗口聚焦时不重新获取数据，不然浏览器切换tab时会重新获取数据
        gcTime: 1000 * 60 * 60 * 12, // 12小时后自动垃圾回收，防止内存泄漏
      },
    },
  });
  initI18n().then(() => {
    const root = createRoot(container);
    root.render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <GlobalConfigProvider />
        </QueryClientProvider>
      </BrowserRouter>,
    );
  });
} else {
  console.error('Root element not found');
}
