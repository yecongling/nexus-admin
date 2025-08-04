import { isEqual } from 'lodash-es';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Card, Table, App } from 'antd';
import type React from 'react';
import { useReducer, useState } from 'react';
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

/**
 * 用户管理
 */
const User: React.FC = () => {
  const { modal, message } = App.useApp();
  const { preferences } = usePreferencesStore();
  const { theme } = preferences;
  const { t } = useTranslation();
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

  // 处理用户更新状态
  const handleUpdateStatusMutation = useMutation({
    mutationFn: (record: UserModel) => userService.updateBatchUserStatus([record.id], record.status === 1 ? 0 : 1),
    onSuccess: () => {
      refetch();
    },
  });

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
  const columns = getColumns(handleEdit, handleDetail, t, theme, (record) => [
    {
      key: 'updatePwd',
      label: '修改密码',
      icon: <Icon icon="fluent:password-reset-48-regular" className="text-xl! block text-orange-300" />,
      onClick: () => {
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
      onClick: () => {
        message.warning('分配角色功能待实现');
      },
    },
    {
      key: 'freeze',
      label: record.status === 1 ? '冻结' : '解冻',
      icon: <Icon icon="fluent-color:lock-shield-32" className="text-xl! block" />,
      onClick: () => handleUpdateStatusMutation.mutate(record),
    },
    {
      key: 'operation',
      label: '操作记录',
      icon: <Icon icon="fluent-color:history-48" className="text-xl! block" />,
      onClick: () => {
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
      onClick: () => {
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
  ]);

  return (
    <>
      {/* 搜索表单 */}
      <SearchForm onSearch={handleSearch} isLoading={isLoading} />

      {/* 查询表格 */}
      <Card style={{ flex: 1, marginTop: '8px', minHeight: 0 }} styles={{ body: { height: '100%' } }} ref={parentRef}>
        {/* 操作按钮 */}
        <TableActionButtons
          handleAdd={handleAdd}
          handleBatchDelete={handleBatchDelete}
          refetch={refetch}
          selectedRows={state.selectedRows}
        />

        {/* 表格数据 */}
        <Table
          size="small"
          style={{ marginTop: '8px' }}
          bordered
          pagination={{
            pageSize: searchParams.pageSize,
            current: searchParams.pageNum,
            showQuickJumper: true,
            hideOnSinglePage: false,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
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
          scroll={{ y: height - 128, x: 'max-content' }}
          rowSelection={{
            onChange: (_selectedRowKeys, selectedRows) => {
              dispatch({
                selectedRows: selectedRows,
              });
            },
            columnWidth: 32,
            fixed: true,
          }}
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
    </>
  );
};

export default User;
