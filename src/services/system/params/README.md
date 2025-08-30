# 系统参数服务 (System Parameters Service)

## 概述

系统参数服务提供了系统参数的增删改查、导入导出等功能，支持权限控制和分页查询。

## 功能特性

- ✅ 分页查询系统参数
- ✅ 新增系统参数
- ✅ 编辑系统参数
- ✅ 删除系统参数
- ✅ 批量删除系统参数
- ✅ 导入系统参数（支持 Excel、CSV 格式）
- ✅ 导出系统参数
- ✅ 获取参数分类列表
- ✅ 完整的权限控制

## 权限配置

系统参数模块需要以下权限配置：

### 基础权限
- `param:view` - 查看系统参数
- `param:add` - 新增系统参数
- `param:edit` - 编辑系统参数
- `param:delete` - 删除系统参数
- `param:import` - 导入系统参数
- `param:export` - 导出系统参数

### 权限说明
- 新增按钮：需要 `param:add` 权限
- 编辑按钮：需要 `param:edit` 权限
- 删除按钮：需要 `param:delete` 权限
- 批量删除：需要 `param:delete` 权限
- 导入功能：需要 `param:import` 权限
- 导出功能：需要 `param:export` 权限
- 状态切换：需要 `param:edit` 权限

## API 接口

### 查询接口
- `GET /system/param/queryParamsList` - 分页查询系统参数
- `GET /system/param/getParamById/{id}` - 根据ID查询系统参数
- `GET /system/param/getParamCategoryList` - 获取参数分类列表

### 操作接口
- `POST /system/param/addParam` - 新增系统参数
- `PUT /system/param/updateParam/{id}` - 更新系统参数
- `DELETE /system/param/deleteParam/{id}` - 删除系统参数
- `DELETE /system/param/deleteBatchParams` - 批量删除系统参数

### 导入导出接口
- `POST /system/param/importParams` - 导入系统参数
- `GET /system/param/exportParams` - 导出系统参数

## 使用示例

```typescript
import { sysParamService } from '@/services/system/params';

// 分页查询
const result = await sysParamService.queryParams({
  pageNum: 1,
  pageSize: 10,
  name: '参数名'
});

// 新增参数
const success = await sysParamService.createParam({
  category: 'SYSTEM',
  code: 'TEST_PARAM',
  name: '测试参数',
  dataType: 'STRING',
  value: 'test',
  required: true,
  status: 1
});

// 导入参数
const file = new File([''], 'params.xlsx');
const success = await sysParamService.importParams(file);

// 导出参数
const blob = await sysParamService.exportParams();
```

## 类型定义

### SysParam
系统参数实体，包含参数的基本信息、配置和元数据。

### SysParamSearchParams
查询参数，继承自 `PageQueryParams`，支持分页和条件查询。

### SysParamFormData
表单数据，用于新增和编辑系统参数。

### PageResult<T>
统一分页响应对象，支持泛型，包含分页信息和数据列表。

## 注意事项

1. 所有操作都需要相应的权限配置
2. 导入功能支持 Excel (.xlsx, .xls) 和 CSV 格式
3. 导出功能会返回 Blob 对象，需要前端处理下载
4. 参数标识必须符合命名规范：以字母开头，只能包含字母、数字和下划线
5. 状态变更需要编辑权限
