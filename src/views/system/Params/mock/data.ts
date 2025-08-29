import type { SysParam } from '../types';

/**
 * 模拟系统参数数据
 */
export const mockSysParams: SysParam[] = [
  {
    id: 1,
    category: 'SYSTEM',
    categoryName: '系统配置',
    code: 'codeSwitch',
    name: '发送验证码开关',
    description: '控制是否允许发送验证码',
    dataType: 'BOOLEAN',
    defaultValue: 'false',
    value: 'off',
    validatationRule: '',
    required: true,
    relatedParam: '',
    status: 1,
    delFlag: false,
    createBy: 1,
    createTime: '2022-02-19T15:51:00.000Z',
    updateBy: 1,
    updateTime: '2022-02-19T15:51:00.000Z',
  },
  {
    id: 2,
    category: 'BUSINESS',
    categoryName: '业务配置',
    code: 'msgConfig',
    name: '短信配置',
    description: '短信服务相关配置',
    dataType: 'STRING',
    defaultValue: '',
    value: 'mobile=1',
    validatationRule: '',
    required: false,
    relatedParam: '',
    status: 1,
    delFlag: false,
    createBy: 1,
    createTime: '2022-02-19T15:49:00.000Z',
    updateBy: 1,
    updateTime: '2022-02-19T15:49:00.000Z',
  },
  {
    id: 3,
    category: 'SECURITY',
    categoryName: '安全配置',
    code: 'passwordPolicy',
    name: '密码策略',
    description: '用户密码复杂度要求',
    dataType: 'JSON',
    defaultValue: '{"minLength":8,"requireUppercase":true,"requireLowercase":true,"requireNumbers":true,"requireSymbols":false}',
    value: '{"minLength":8,"requireUppercase":true,"requireLowercase":true,"requireNumbers":true,"requireSymbols":false}',
    validatationRule: '',
    required: true,
    relatedParam: '',
    status: 1,
    delFlag: false,
    createBy: 1,
    createTime: '2022-02-19T15:45:00.000Z',
    updateBy: 1,
    updateTime: '2022-02-19T15:45:00.000Z',
  },
  {
    id: 4,
    category: 'SYSTEM',
    categoryName: '系统配置',
    code: 'sessionTimeout',
    name: '会话超时时间',
    description: '用户会话超时时间（分钟）',
    dataType: 'NUMBER',
    defaultValue: '30',
    value: '30',
    validatationRule: 'min:5,max:1440',
    required: true,
    relatedParam: '',
    status: 1,
    delFlag: false,
    createBy: 1,
    createTime: '2022-02-19T15:40:00.000Z',
    updateBy: 1,
    updateTime: '2022-02-19T15:40:00.000Z',
  },
  {
    id: 5,
    category: 'BUSINESS',
    categoryName: '业务配置',
    code: 'maxUploadSize',
    name: '最大上传文件大小',
    description: '允许上传的最大文件大小（MB）',
    dataType: 'NUMBER',
    defaultValue: '10',
    value: '10',
    validatationRule: 'min:1,max:100',
    required: false,
    relatedParam: '',
    status: 0,
    delFlag: false,
    createBy: 1,
    createTime: '2022-02-19T15:35:00.000Z',
    updateBy: 1,
    updateTime: '2022-02-19T15:35:00.000Z',
  },
  {
    id: 6,
    category: 'OTHER',
    categoryName: '其他配置',
    code: 'maintenanceMode',
    name: '维护模式',
    description: '系统维护模式开关',
    dataType: 'BOOLEAN',
    defaultValue: 'false',
    value: 'false',
    validatationRule: '',
    required: false,
    relatedParam: '',
    status: 1,
    delFlag: false,
    createBy: 1,
    createTime: '2022-02-19T15:30:00.000Z',
    updateBy: 1,
    updateTime: '2022-02-19T15:30:00.000Z',
  },
  {
    id: 7,
    category: 'SYSTEM',
    categoryName: '系统配置',
    code: 'logLevel',
    name: '日志级别',
    description: '系统日志记录级别',
    dataType: 'STRING',
    defaultValue: 'INFO',
    value: 'INFO',
    validatationRule: 'enum:DEBUG,INFO,WARN,ERROR',
    required: true,
    relatedParam: '',
    status: 1,
    delFlag: false,
    createBy: 1,
    createTime: '2022-02-19T15:25:00.000Z',
    updateBy: 1,
    updateTime: '2022-02-19T15:25:00.000Z',
  },
  {
    id: 8,
    category: 'SECURITY',
    categoryName: '安全配置',
    code: 'loginAttempts',
    name: '登录尝试次数',
    description: '允许的最大登录失败次数',
    dataType: 'NUMBER',
    defaultValue: '5',
    value: '5',
    validatationRule: 'min:3,max:10',
    required: true,
    relatedParam: 'lockoutDuration',
    status: 1,
    delFlag: false,
    createBy: 1,
    createTime: '2022-02-19T15:20:00.000Z',
    updateBy: 1,
    updateTime: '2022-02-19T15:20:00.000Z',
  },
];

/**
 * 模拟API响应
 */
export const mockApiResponse = {
  success: true,
  code: 200,
  message: '操作成功',
  data: {
    data: mockSysParams,
    total: mockSysParams.length,
  },
};

/**
 * 模拟分页数据
 */
export const getMockPagedData = (pageNum: number, pageSize: number, filters?: any) => {
  let filteredData = [...mockSysParams];
  
  // 应用过滤条件
  if (filters) {
    if (filters.name) {
      filteredData = filteredData.filter(item => 
        item.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    if (filters.code) {
      filteredData = filteredData.filter(item => 
        item.code.toLowerCase().includes(filters.code.toLowerCase())
      );
    }
    if (filters.category) {
      filteredData = filteredData.filter(item => item.category === filters.category);
    }
  }
  
  // 计算分页
  const startIndex = (pageNum - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pagedData = filteredData.slice(startIndex, endIndex);
  
  return {
    success: true,
    code: 200,
    message: '查询成功',
    data: {
      data: pagedData,
      total: filteredData.length,
    },
  };
};
