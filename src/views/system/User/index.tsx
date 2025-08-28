import { isEqual } from 'lodash-es';
import {
  ExclamationCircleFilled,
  UserOutlined,
  LockOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { Card, Table, App, Statistic, Progress, Typography } from 'antd';
import type React from 'react';
import { useMemo, useReducer, useState } from 'react';
import useParentSize from '@/hooks/useParentSize';
import { userService } from '@/services/system/user/userApi';
import type { UserSearchParams } from './types';
import { getColumns } from './columns';
import SearchForm from './SearchForm';
import UserInfoModal from './UserInfoModal';
import type { UserModel } from '@/services/system/user/type';
import { useMutation, useQuery } from '@tanstack/react-query';
import TableActionButtons from './TableActionButtons';
import UserPasswordModal from './UserPasswordModal';
import { useTranslation } from 'react-i18next';
import { usePreferencesStore } from '@/stores/store';
import { Icon } from '@iconify-icon/react';
import Operation from './Operation';
import { MyIcon } from '@/components/MyIcon';
import { usePermission } from '@/hooks/usePermission';

/**
 * 用户管理
 */
const User: React.FC = () => {
  const { modal, message } = App.useApp();
  const colorPrimary = usePreferencesStore((state) => state.preferences.theme.colorPrimary);
  const { t } = useTranslation();
  const { Text: AntText } = Typography;

  // 权限检查
  const canUpdatePassword = usePermission(['sys:user:updatePassword']);
  const canAssignRole = usePermission(['sys:user:assignRole']);
  const canUpdateStatus = usePermission(['sys:user:updateStatus']);
  const canViewOperationLog = usePermission(['sys:user:viewOperationLog']);
  const canDeleteUser = usePermission(['sys:user:delete']);
  // 合并状态
  const [state, dispatch] = useReducer(
    (prev: any, action: any) => ({
      ...prev,
      ...action,
    }),
    {
      // 编辑窗口的打开状态
      openEditModal: false,
      // 修改密码弹窗的打开状态
      openPasswordModal: false,
      // 操作记录弹窗的打开状态
      openOperationModal: false,
      // 当前编辑的行数据
      currentRow: null,
      // 当前选中的行数据
      selectedRows: [],
      // 当前操作
      action: '',
    },
  );

  // 容器高度计算（表格）
  const { parentRef, height } = useParentSize();

  // 查询参数（包含分页参数）
  const [searchParams, setSearchParams] = useState<UserSearchParams>({
    pageNum: 1,
    pageSize: 20,
  });

  // 查询用户数据
  const {
    isLoading,
    data: result,
    refetch,
  } = useQuery({
    queryKey: ['sys_users', searchParams],
    queryFn: () => userService.queryUsers({ ...searchParams }),
  });

  // 计算统计数据
  const stats = useMemo(() => {
    if (!result?.data) return { total: 0, active: 0, inactive: 0, male: 0, female: 0 };

    const data = result.data;
    return {
      total: result.total || 0,
      active: data.filter((user: UserModel) => user.status === 1).length,
      inactive: data.filter((user: UserModel) => user.status === 0).length,
      male: data.filter((user: UserModel) => user.sex === '1').length,
      female: data.filter((user: UserModel) => user.sex === '2').length,
    };
  }, [result]);

  // 处理删除数据
  const logicDeleteUserMutation = useMutation({
    mutationFn: (ids: string[]) => userService.logicDeleteUsers(ids),
    onSuccess: () => {
      dispatch({
        selectedRows: [],
      });
      refetch();
    },
  });

  // 处理搜索
  const handleSearch = (values: UserSearchParams) => {
    const search = {
      ...values,
      pageNum: searchParams.pageNum,
      pageSize: searchParams.pageSize,
    };
    // 判断参数是否发生变化
    if (isEqual(search, searchParams)) {
      // 参数没有变化，手动刷新数据
      refetch();
      return;
    }
    setSearchParams((prev: UserSearchParams) => ({ ...prev, ...search }));
  };

  // 处理编辑
  const handleEdit = (record: UserModel) => {
    dispatch({
      openEditModal: true,
      currentRow: record,
      action: 'edit',
    });
  };

  // 处理详情
  const handleDetail = (record: UserModel) => {
    dispatch({
      openEditModal: true,
      currentRow: record,
      action: 'view',
    });
  };

  // 处理新增
  const handleAdd = () => {
    dispatch({
      openEditModal: true,
      currentRow: null,
      action: 'add',
    });
  };

  // 处理批量删除
  const handleBatchDelete = () => {
    modal.confirm({
      title: '确定要删除选中的用户吗？',
      icon: <ExclamationCircleFilled />,
      content: '此操作将删除选中的用户，删除后可在回收站中进行恢复，是否继续？',
      onOk() {
        const ids = state.selectedRows.map((row: Partial<UserModel>) => row.id);
        // 调用批量删除接口(逻辑删除)
        logicDeleteUserMutation.mutate(ids);
      },
    });
  };

  // 更新用户mutation
  const updateUserMutation = useMutation({
    mutationFn: (values: Partial<UserModel>) => userService.updateUser({ id: state.currentRow.id, ...values }),
    onSuccess: () => {
      dispatch({
        openEditModal: false,
      });
      refetch();
    },
  });

  // 新增用户mutation
  const createUserMutation = useMutation({
    mutationFn: (values: Partial<UserModel>) => userService.createUser(values),
    onSuccess: () => {
      dispatch({
        openEditModal: false,
      });
      refetch();
    },
  });

  // 处理表单提交
  const handleModalOk = (values: Partial<UserModel>) => {
    if (state.currentRow?.id) {
      updateUserMutation.mutate(values);
    } else {
      createUserMutation.mutate(values);
    }
  };

  // 关闭密码编辑弹窗
  const closePasswordModal = () => {
    dispatch({
      openPasswordModal: false,
    });
  };

  // 表格操作列中的更多操作
  // 处理状态变更
  const handleStatusChange = (record: UserModel, checked: boolean) => {
    if (!canUpdateStatus) {
      message.warning('您没有更新状态的权限');
      return;
    }

    const newStatus = checked ? 1 : 0;
    userService
      .updateBatchUserStatus([record.id], newStatus)
      .then(() => {
        message.success(`用户状态已${checked ? '启用' : '禁用'}`);
        refetch();
      })
      .catch(() => {
        message.error('状态更新失败');
      });
  };

  const columns = useMemo(
    () =>
      getColumns(
        handleEdit,
        handleDetail,
        t,
        colorPrimary,
        (record) => [
          {
            key: 'updatePwd',
            label: '修改密码',
            icon: <Icon icon="fluent:password-reset-48-regular" className="text-xl! block text-orange-300" />,
            disabled: !canUpdatePassword,
            onClick: () => {
              if (!canUpdatePassword) {
                message.warning('您没有修改密码的权限');
                return;
              }
              /* 打开密码编辑弹窗 */
              dispatch({
                openPasswordModal: true,
                currentRow: record,
              });
            },
          },
          {
            key: 'assignRole',
            label: '分配角色',
            icon: <MyIcon type="nexus-assigned" className="text-xl! block" />,
            disabled: !canAssignRole,
            onClick: () => {
              if (!canAssignRole) {
                message.warning('您没有分配角色的权限');
                return;
              }
              message.warning('分配角色功能待实现');
            },
          },

          {
            key: 'operation',
            label: '操作记录',
            icon: <Icon icon="fluent-color:history-48" className="text-xl! block" />,
            disabled: !canViewOperationLog,
            onClick: () => {
              if (!canViewOperationLog) {
                message.warning('您没有查看操作记录的权限');
                return;
              }
              // 打开操作记录弹窗
              dispatch({
                openOperationModal: true,
                currentRow: record,
              });
            },
          },
          {
            key: 'delete',
            label: t('common.operation.delete'),
            icon: <Icon icon="fluent:delete-dismiss-24-filled" className="text-xl! block text-[#ff4d4f]!" />,
            disabled: !canDeleteUser,
            onClick: () => {
              if (!canDeleteUser) {
                message.warning('您没有删除用户的权限');
                return;
              }
              modal.confirm({
                title: '删除用户',
                icon: <ExclamationCircleFilled />,
                content: '确定删除该用户吗？数据删除后请在回收站中恢复！',
                onOk() {
                  logicDeleteUserMutation.mutate([record.id]);
                },
              });
            },
          },
        ],
        handleStatusChange,
        canUpdateStatus,
      ),
    [handleStatusChange, canUpdateStatus],
  );

  return (
    <div className="user-management-container">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        <Card className="text-center hover:shadow-md transition-shadow cursor-pointer h-32 flex flex-col justify-center">
          <Statistic
            title="总用户数"
            value={stats.total}
            prefix={<UserOutlined className="text-blue-500" />}
            valueStyle={{ color: '#1890ff' }}
          />
          <Progress percent={100} showInfo={false} strokeColor="#1890ff" size="small" className="mt-2" />
        </Card>

        <Card className="text-center hover:shadow-md transition-shadow cursor-pointer h-32 flex flex-col justify-center">
          <Statistic
            title="活跃用户"
            value={stats.active}
            prefix={<CheckCircleOutlined className="text-green-500" />}
            valueStyle={{ color: '#52c41a' }}
          />
          <Progress
            percent={stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}
            showInfo={false}
            strokeColor="#52c41a"
            size="small"
            className="mt-2"
          />
        </Card>

        <Card className="text-center hover:shadow-md transition-shadow cursor-pointer h-32 flex flex-col justify-center">
          <Statistic
            title="冻结用户"
            value={stats.inactive}
            prefix={<LockOutlined className="text-orange-500" />}
            valueStyle={{ color: '#fa8c16' }}
          />
          <Progress
            percent={stats.total > 0 ? Math.round((stats.inactive / stats.total) * 100) : 0}
            showInfo={false}
            strokeColor="#fa8c16"
            size="small"
            className="mt-2"
          />
        </Card>

        <Card className="text-center hover:shadow-md transition-shadow cursor-pointer h-32 flex flex-col justify-center">
          <Statistic
            title="性别分布"
            value={`${stats.male}:${stats.female}`}
            prefix={<Icon icon="fluent:people-48-regular" className="text-purple-500 text-2xl" />}
            valueStyle={{ color: '#722ed1' }}
          />
          <div className="flex justify-center mt-2">
            <AntText type="secondary" className="text-xs">
              男: {stats.male} | 女: {stats.female}
            </AntText>
          </div>
        </Card>
      </div>

      {/* 搜索表单 */}
      <SearchForm onSearch={handleSearch} isLoading={isLoading} />

      {/* 查询表格 */}
      <Card
        style={{ flex: 1, marginTop: '16px', minHeight: 0 }}
        styles={{ body: { height: '100%' } }}
        ref={parentRef}
        title={
          <div className="flex items-center justify-between">
            <span>用户列表</span>
            <div className="flex items-center space-x-2">
              <AntText type="secondary" className="text-sm">
                已选择 <span className="text-blue-500 font-medium">{state.selectedRows.length}</span> 项
              </AntText>
              {state.selectedRows.length > 0 && (
                <AntText type="secondary" className="text-sm">
                  | 共 {result?.total || 0} 条记录
                </AntText>
              )}
            </div>
          </div>
        }
      >
        {/* 操作按钮 */}
        <div className="mb-4">
          <TableActionButtons
            handleAdd={handleAdd}
            handleBatchDelete={handleBatchDelete}
            refetch={refetch}
            selectedRows={state.selectedRows}
          />
        </div>

        {/* 表格数据 */}
        <Table
          size="middle"
          bordered
          pagination={{
            pageSize: searchParams.pageSize,
            current: searchParams.pageNum,
            showQuickJumper: true,
            hideOnSinglePage: false,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
            total: result?.total || 0,
            onChange(page, pageSize) {
              setSearchParams({
                ...searchParams,
                pageNum: page,
                pageSize: pageSize,
              });
            },
          }}
          dataSource={result?.data || []}
          columns={columns}
          loading={isLoading}
          rowKey="id"
          scroll={{ y: height - 200, x: 'max-content' }}
          rowSelection={{
            onChange: (_selectedRowKeys, selectedRows) => {
              dispatch({
                selectedRows: selectedRows,
              });
            },
            columnWidth: 32,
            fixed: true,
          }}
          rowClassName={(record) => (record.status === 0 ? 'opacity-60 bg-gray-50' : '')}
        />
      </Card>

      {/* 编辑弹窗 */}
      <UserInfoModal
        visible={state.openEditModal}
        onOk={handleModalOk}
        onCancel={() => {
          dispatch({
            openEditModal: false,
            currentRow: null,
          });
        }}
        userInfo={state.currentRow}
        action={state.action}
      />

      {/* 密码编辑弹窗 */}
      <UserPasswordModal
        open={state.openPasswordModal}
        userInfo={state.currentRow}
        onClose={closePasswordModal}
        onOk={closePasswordModal}
      />

      {/* 操作记录弹窗 */}
      <Operation
        userInfo={state.currentRow}
        visible={state.openOperationModal}
        onCancel={() => {
          dispatch({
            openOperationModal: false,
          });
        }}
      />
    </div>
  );
};

export default User;
