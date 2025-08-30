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
  status: number;
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
  status: number;
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
  { label: '字符串', value: 'STRING' },
  { label: '数字', value: 'NUMBER' },
  { label: '布尔值', value: 'BOOLEAN' },
  { label: '日期', value: 'DATE' },
  { label: 'JSON', value: 'JSON' },
];

/**
 * 状态选项
 */
export const STATUS_OPTIONS = [
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 },
];

/**
 * 参数分类选项
 */
export const CATEGORY_OPTIONS = [
  { label: '系统配置', value: 'SYSTEM' },
  { label: '业务配置', value: 'BUSINESS' },
  { label: '安全配置', value: 'SECURITY' },
  { label: '其他配置', value: 'OTHER' },
];
