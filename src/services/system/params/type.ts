import type { PageQueryParams } from '@/types/global';

/**
 * 系统参数实体
 */
export interface SysParam {
  id: number;
  category: string;
  categoryName: string;
  code: string;
  name: string;
  description?: string;
  dataType: string;
  defaultValue?: string;
  value?: string;
  validatationRule?: string;
  required: boolean;
  relatedParam?: string;
  status: boolean;
  delFlag: boolean;
  createBy: number;
  createTime: string;
  updateBy: number;
  updateTime: string;
}

/**
 * 系统参数查询参数
 */
export interface SysParamSearchParams extends PageQueryParams {
  name?: string;
  code?: string;
  category?: string;
}

/**
 * 系统参数表单数据
 */
export interface SysParamFormData {
  id?: number;
  category: string;
  categoryName: string;
  code: string;
  name: string;
  description?: string;
  dataType: string;
  defaultValue?: string;
  value?: string;
  validatationRule?: string;
  required: boolean;
  relatedParam?: string;
  status: boolean;
}

/**
 * 参数分类选项
 */
export interface ParamCategory {
  value: string;
  label: string;
}

/**
 * 数据类型选项
 */
export const DATA_TYPE_OPTIONS = [
  { label: '字符串', value: 'string' },
  { label: '数字', value: 'number' },
  { label: '布尔值', value: 'boolean' },
  { label: '日期', value: 'date' },
  { label: 'JSON', value: 'json' },
];

/**
 * 参数分类选项
 */
export const CATEGORY_OPTIONS = [
  { label: '系统参数', value: 'system' },
  { label: '用户参数', value: 'user' },
  { label: '业务参数', value: 'business' },
  { label: '安全参数', value: 'security' },
  { label: '其他参数', value: 'other' },
];

/**
 * 导出选项
 */
export interface ExportOptions {
  type: 'all' | 'selected';
  selectedIds?: number[];
  searchParams?: SysParamSearchParams;
}
