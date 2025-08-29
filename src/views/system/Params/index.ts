// 导出主组件
export { default } from './index.tsx';

// 导出类型定义
export type {
  SysParam,
  SysParamSearchParams,
  SysParamFormData,
} from './types';

// 导出API服务
export { sysParamService } from './api';

// 导出模拟服务（开发阶段使用）
export { mockSysParamService } from './mock/api';

// 导出配置
export * from './config';

// 导出组件
export * from './components';
