import type { SysParam, SysParamSearchParams, SysParamFormData } from './types';
import { HttpRequest } from '@/utils/request';

/**
 * 系统参数服务
 */
export const sysParamService = {
  /**
   * 分页查询系统参数
   */
  queryParams: (params: SysParamSearchParams): Promise<{
    pageNum: number;
    pageSize: number;
    total: number;
    records: SysParam[];
  }> => {
    return HttpRequest.get<{
      pageNum: number;
      pageSize: number;
      total: number;
      records: SysParam[];
    }>({
      url: '/api/sys/param/page',
      params,
    });
  },

  /**
   * 根据ID查询系统参数
   */
  getParamById: (id: number): Promise<SysParam> => {
    return HttpRequest.get<SysParam>({
      url: `/api/sys/param/${id}`,
    });
  },

  /**
   * 新增系统参数
   */
  createParam: (data: SysParamFormData): Promise<SysParam> => {
    return HttpRequest.post<SysParam>({
      url: '/api/sys/param',
      data,
    });
  },

  /**
   * 更新系统参数
   */
  updateParam: (id: number, data: SysParamFormData): Promise<SysParam> => {
    return HttpRequest.put<SysParam>({
      url: `/api/sys/param/${id}`,
      data,
    });
  },

  /**
   * 删除系统参数
   */
  deleteParam: (id: number): Promise<SysParam> => {
    return HttpRequest.delete<SysParam>({
      url: `/api/sys/param/${id}`,
    });
  },

  /**
   * 批量删除系统参数
   */
  batchDeleteParams: (ids: number[]): Promise<SysParam> => {
    return HttpRequest.delete<SysParam>({
      url: '/api/sys/param/batch',
      data: { ids },
    });
  },

  /**
   * 获取参数分类列表
   */
  getCategories: (): Promise<Array<{ value: string; label: string }>> => {
    return HttpRequest.get<Array<{ value: string; label: string }>>({
      url: '/api/sys/param/categories',
    });
  },
};
