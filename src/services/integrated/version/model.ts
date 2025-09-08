/**
 * 流程版本管理相关实体类
 */

// 版本锁表实体
export interface WorkflowLock {
  id: number;
  workflowId: number;
  version: string;
  lockToken: string;
  lockedBy: number;
  lockedAt: string;
  expiresAt: string;
  lockType: 'EDIT' | 'PUBLISH' | 'DELETE';
}

// 流程版本主表实体
export interface WorkflowVersion {
  id: number;
  workflowId: number;
  version: string;
  versionName?: string;
  description?: string;
  versionType: 'MAJOR' | 'MINOR' | 'PATCH' | 'HOTFIX';
  status: number; // 1: DRAFT, 2: PUBLISHED, 3: DEPRECATED, 4: ARCHIVED
  basedOnVersion?: string;
  isSnapshot: boolean;
  storageType: 'FULL' | 'DELTA';
  fileSize: number;
  checkSum?: string;
  tags?: any; // JSON
  metadata?: any; // JSON
  publishedBy: number;
  publishedTime: string;
  createBy: number;
  createTime: string;
  updateBy: number;
  updateTime: string;
}

// 版本分支表实体
export interface WorkflowBranch {
  id: number;
  workflowId: number;
  branchName: string;
  branchType: 'MASTER' | 'FEATURE' | 'HOTFIX' | 'RELEASE';
  baseVersion: string;
  headVersion?: string;
  createdBy: number;
  createdAt: string;
  status: 'ACTIVE' | 'MERGED' | 'DELETED';
  mergedAt?: string;
  mergedBy?: number;
}

// 版本差异表实体
export interface WorkflowVersionDelta {
  id: number;
  workflowId: number;
  fromVersion: string;
  toVersion: string;
  deltaType: 'ADD' | 'MODIFY' | 'DELETE';
  objectPath: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
}

// 版本状态枚举
export enum VersionStatus {
  DRAFT = 1,
  PUBLISHED = 2,
  DEPRECATED = 3,
  ARCHIVED = 4,
}

// 版本类型枚举
export enum VersionType {
  MAJOR = 'MAJOR',
  MINOR = 'MINOR',
  PATCH = 'PATCH',
  HOTFIX = 'HOTFIX',
}

// 锁类型枚举
export enum LockType {
  EDIT = 'EDIT',
  PUBLISH = 'PUBLISH',
  DELETE = 'DELETE',
}

// 分支类型枚举
export enum BranchType {
  MASTER = 'MASTER',
  FEATURE = 'FEATURE',
  HOTFIX = 'HOTFIX',
  RELEASE = 'RELEASE',
}

// 分支状态枚举
export enum BranchStatus {
  ACTIVE = 'ACTIVE',
  MERGED = 'MERGED',
  DELETED = 'DELETED',
}

// 差异类型枚举
export enum DeltaType {
  ADD = 'ADD',
  MODIFY = 'MODIFY',
  DELETE = 'DELETE',
}

// 存储类型枚举
export enum StorageType {
  FULL = 'FULL',
  DELTA = 'DELTA',
}

// 版本列表查询参数
export interface VersionListParams {
  workflowId: number;
  pageNum?: number;
  pageSize?: number;
  status?: number;
  branch?: string;
  keyword?: string;
}

// 版本创建参数
export interface CreateVersionParams {
  workflowId: number;
  versionType: VersionType;
  versionName: string;
  description?: string;
  basedOnVersion: string;
  publishImmediately?: boolean;
}

// 版本对比参数
export interface VersionCompareParams {
  workflowId: number;
  baseVersion: string;
  targetVersion: string;
}

// 版本发布参数
export interface PublishVersionParams {
  workflowId: number;
  version: string;
  publishNote?: string;
}

// 版本回滚参数
export interface RollbackVersionParams {
  workflowId: number;
  fromVersion: string;
  toVersion: string;
  rollbackNote?: string;
}
