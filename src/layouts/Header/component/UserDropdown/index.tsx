import { App, Avatar, Divider, Dropdown, theme, type MenuProps } from 'antd';
import type { ReactNode } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import {
  ExclamationCircleOutlined,
  FileMarkdownOutlined,
  InfoCircleOutlined,
  LockOutlined,
  LogoutOutlined,
  QuestionCircleFilled,
  SyncOutlined,
  UserOutlined,
} from '@ant-design/icons';
import avatar from '@/assets/images/avatar.png';
import { commonService } from '@/services/common';
import { usePreferencesStore } from '@/stores/store';
import { useUserStore } from '@/stores/userStore';

/**
 * 用户信息下拉框
 * @returns
 */
const UserDropdown: React.FC = () => {
  const { updatePreferences } = usePreferencesStore();
  const userStore = useUserStore(); 
  const { token } = theme.useToken();
  const { modal } = App.useApp();
  const { t } = useTranslation();

  const navigate = useNavigate();

  // 菜单栏
  const items: MenuProps['items'] = [
    {
      key: 'doc',
      label: t('layout.header.userDropdown.doc'),
      icon: <FileMarkdownOutlined />,
    },
    {
      key: '1',
      label: t('layout.header.userDropdown.profile'),
      icon: <UserOutlined />,
      disabled: false,
      onClick: () => {
        // 个人中心做成一个弹窗，内部可以修改
      },
    },
    {
      key: 'switchRole',
      label: t('layout.header.userDropdown.switchRole'),
      icon: <UserOutlined />,
      disabled: false,
      popupStyle: {
        width: 220,
      },
      popupOffset: [2, 8],
      children: [
        {
          key: 'role1',
          label: '角色1',
          icon: <UserOutlined />,
          onClick: () => {
            // 跳转到问题反馈
          },
        },
        {
          key: 'role2',
          label: '角色2',
          icon: <UserOutlined />,
          onClick: () => {
            // 跳转到常见问题
          },
        },
      ],
    },
    {
      key: 'help',
      label: t('layout.header.userDropdown.support'),
      icon: <QuestionCircleFilled />,
      popupStyle: {
        width: 220,
      },
      popupOffset: [2, 8],
      children: [
        {
          key: 'help1',
          label: t('layout.header.userDropdown.feedback'),
          icon: <QuestionCircleFilled />,
          onClick: () => {
            // 跳转到问题反馈
          },
        },
        {
          key: 'help2',
          label: t('layout.header.userDropdown.question'),
          icon: <QuestionCircleFilled />,
          onClick: () => {
            // 跳转到常见问题
          },
        },
      ],
    },
    {
      type: 'divider',
    },
    {
      key: 'about',
      label: (
        <div className="flex items-center justify-between">
          <span>{t('layout.header.userDropdown.about')}</span>
          <div className="flex items-center">
            <div className="text-[12px]">0.0.1</div>
            <div className="w-2 h-2 bg-green-400 rounded-sm ml-1" />
          </div>
        </div>
      ),
      icon: <InfoCircleOutlined />,
      onClick: () => {
        // 跳转到关于
      },
    },
    {
      key: '3',
      label: t('layout.header.userDropdown.refresh'),
      icon: <SyncOutlined />,
      onClick: () => {
        // 后端的缓存信息（相当于把缓存数据刷新）
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'lock',
      label: t('layout.header.lock'),
      icon: <LockOutlined />,
      onClick: () => {
        updatePreferences('widget', 'lockScreenStatus', true);
      },
    },
    {
      type: 'divider',
    },
    {
      key: '4',
      label: t('layout.header.userDropdown.logout'),
      icon: <LogoutOutlined />,
      disabled: false,
      danger: true,
      onClick: () => {
        modal.confirm({
          title: t('layout.header.userDropdown.logout'),
          icon: <ExclamationCircleOutlined />,
          content: t('login.confirmLogout'),
          onOk: () => {
            const token = userStore.token;

            // 清除后端的信息
            commonService.logout(token as string).then((res: boolean) => {
              if (res) {
                // 清空token
                userStore.logout();
                // 修改回document.title
                document.title = 'nexus';
                // 退出到登录页面
                navigate('/login', { replace: true });
              }
            });
          },
        });
      },
    },
  ];

  /**
   * 内容样式
   */
  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };

  /**
   * 自定义渲染
   * @param menus 菜单
   * @returns
   */
  const renderDropdown = (menus: ReactNode) => {
    return (
      <div className="dropdownContent" style={contentStyle}>
        <div className="avatar flex items-center p-3">
          <Avatar size="large" src={avatar} />
        </div>
        <Divider style={{ margin: '2px 0' }} />
        {menus}
      </div>
    );
  };

  return (
    <Dropdown
      trigger={['hover']}
      menu={{ items, triggerSubMenuAction: 'hover' }}
      popupRender={renderDropdown}
      placement="bottomLeft"
      overlayStyle={{ width: 240 }}
    >
      <div className="login-user flex items-center cursor-pointer justify-between h-[50] transition-all duration-300">
        <Avatar size="default" src={avatar} />
        <span style={{ margin: '0 0 0 6px' }}>{userStore.loginUser}</span>
      </div>
    </Dropdown>
  );
};

export default UserDropdown;
