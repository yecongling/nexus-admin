import { getMockPagedData, mockSysParams } from './data';
import type { SysParamSearchParams, SysParamFormData } from '../types';

/**
 * 模拟系统参数服务（开发阶段使用）
 */
export const mockSysParamService = {
  /**
   * 分页查询系统参数
   */
  queryParams: async (params: SysParamSearchParams) => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const { pageNum = 1, pageSize = 10, name, code, category } = params;
    
    return getMockPagedData(pageNum, pageSize, { name, code, category });
  },

  /**
   * 根据ID查询系统参数
   */
  getParamById: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const param = mockSysParams.find(item => item.id === id);
    
    if (!param) {
      throw new Error('参数不存在');
    }
    
    return {
      success: true,
      code: 200,
      message: '查询成功',
      data: param,
    };
  },

  /**
   * 新增系统参数
   */
  createParam: async (data: SysParamFormData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 模拟验证
    if (mockSysParams.some(item => item.code === data.code)) {
      throw new Error('参数标识已存在');
    }
    
    return {
      success: true,
      code: 200,
      message: '新增成功',
      data: null,
    };
  },

  /**
   * 更新系统参数
   */
  updateParam: async (id: number, data: SysParamFormData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const param = mockSysParams.find(item => item.id === id);
    if (!param) {
      throw new Error('参数不存在');
    }
    
    // 模拟验证
    if (mockSysParams.some(item => item.code === data.code && item.id !== id)) {
      throw new Error('参数标识已存在');
    }
    
    return {
      success: true,
      code: 200,
      message: '更新成功',
      data: null,
    };
  },

  /**
   * 删除系统参数
   */
  deleteParam: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const param = mockSysParams.find(item => item.id === id);
    if (!param) {
      throw new Error('参数不存在');
    }
    
    return {
      success: true,
      code: 200,
      message: '删除成功',
      data: null,
    };
  },

  /**
   * 批量删除系统参数
   */
  batchDeleteParams: async (ids: number[]) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (ids.length === 0) {
      throw new Error('请选择要删除的参数');
    }
    
    return {
      success: true,
      code: 200,
      message: '批量删除成功',
      data: null,
    };
  },

  /**
   * 获取参数分类列表
   */
  getCategories: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const categories = [
      { label: '系统配置', value: 'SYSTEM' },
      { label: '业务配置', value: 'BUSINESS' },
      { label: '安全配置', value: 'SECURITY' },
      { label: '其他配置', value: 'OTHER' },
    ];
    
    return {
      success: true,
      code: 200,
      message: '查询成功',
      data: categories,
    };
  },
};
