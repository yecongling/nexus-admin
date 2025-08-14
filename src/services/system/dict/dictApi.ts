import { HttpRequest } from '@/utils/request';
import type { DictItemSearchParams, DictModel, DictSearchParams } from './type';

/**
 * 字典相关接口
 */
const DictApi = {
  /**
   * 查询字典数据
   */
  getDictList: '/system/dict/getDictList',

  /**
   * 创建字典
   */
  addDict: '/system/dict/addDict',
  /**
   * 删除字典
   */
  deleteDict: '/system/dict/deleteDict',
  /**
   * 更新字典
   */
  updateDict: '/system/dict/updateDict',

  /**
   * 查询字典条目
   */
  getDictItemList: '/system/dict/getDictItemList',
  /**
   * 创建字典条目
   */
  addDictItem: '/system/dict/addDictItem',
  /**
   * 删除字典条目
   */
  deleteDictItem: '/system/dict/deleteDictItem',
  /**
   * 更新字典条目
   */
  updateDictItem: '/system/dict/updateDictItem',
};

interface IDictService {
  /**
   * 查询字典数据
   * @param searchParams 字典查询参数
   * @returns 字典数据
   */
  getDictList(searchParams: DictSearchParams): Promise<Record<string, any>>;
  /**
   * 创建字典
   * @param dict 字典信息
   * @returns 创建结果
   */
  addDict(dict: Partial<DictModel>): Promise<boolean>;
  /**
   * 删除字典
   * @param dict 字典编码
   * @returns 删除结果
   */
  deleteDict(dictCode: string): Promise<boolean>;
  /**
   * 更新字典
   * @param dict 字典信息
   * @returns 更新结果
   */
  updateDict(dict: Partial<DictModel>): Promise<boolean>;
  /**
   * 查询字典条目
   * @param dictItems 字典条目查询参数
   * @returns 字典条目
   */
  getDictItemList(dictItems: DictItemSearchParams): Promise<Record<string, any>>;
  /**
   * 创建字典条目
   * @param dictItem 字典条目信息
   * @returns 创建结果
   */
  addDictItem(dictItem: Partial<DictModel>): Promise<boolean>;
  /**
   * 删除字典条目
   * @param dictCode 字典编码
   * @param itemCode 字典条目编码
   * @returns 删除结果
   */
  deleteDictItem(dictCode: string, itemCode: string): Promise<boolean>;
  /**
   * 更新字典条目
   * @param dictItem 字典条目信息
   * @returns 更新结果
   */
  updateDictItem(dictItem: Partial<DictModel>): Promise<boolean>;
}

/**
 * 字典服务实现
 */
export const dictService: IDictService = {
  /**
   * 查询字典数据
   * @param searchParams 字典查询参数
   * @returns 字典数据
   */
  getDictList(searchParams: DictSearchParams): Promise<Record<string, any>> {
    return HttpRequest.get({ url: DictApi.getDictList, params: searchParams }, { successMessageMode: 'none' });
  },

  /**
   * 创建字典
   * @param dict 字典信息
   * @returns 创建结果
   */
  addDict(dict: Partial<DictModel>): Promise<boolean> {
    return HttpRequest.post({ url: DictApi.addDict, params: dict });
  },

  /**
   * 删除字典
   * @param dict 字典编码
   * @returns 删除结果
   */
  deleteDict(dictCode: string): Promise<boolean> {
    return HttpRequest.delete({
      url: DictApi.deleteDict,
      params: { dictCode },
    });
  },
  /**
   * 更新字典
   * @param dict 字典信息
   * @returns 更新结果
   */
  updateDict(dict: Partial<DictModel>): Promise<boolean> {
    return HttpRequest.post({ url: DictApi.updateDict, params: dict });
  },
  /**
   * 查询字典条目
   * @param dictItems 字典条目查询参数
   * @returns 字典条目
   */
  getDictItemList(dictItems: DictItemSearchParams): Promise<Record<string, any>> {
    return HttpRequest.get({ url: DictApi.getDictItemList, params: dictItems }, { successMessageMode: 'none' });
  },
  /**
   * 创建字典条目
   * @param dictItem 字典条目信息
   * @returns 创建结果
   */
  addDictItem(dictItem: Partial<DictModel>): Promise<boolean> {
    return HttpRequest.post({ url: DictApi.addDictItem, params: dictItem });
  },
  /**
   * 删除字典条目
   * @param dictCode 字典编码
   * @param itemCode 字典条目编码
   * @returns 删除结果
   */
  deleteDictItem(dictCode: string, itemCode: string): Promise<boolean> {
    return HttpRequest.delete({
      url: DictApi.deleteDictItem,
      params: { dictCode, itemCode },
    });
  },
  /**
   * 更新字典条目
   * @param dictItem 字典条目信息
   * @returns 更新结果
   */
  updateDictItem(dictItem: Partial<DictModel>): Promise<boolean> {
    return HttpRequest.post({ url: DictApi.updateDictItem, params: dictItem });
  },
};
