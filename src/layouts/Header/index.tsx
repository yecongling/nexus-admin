import {
  Badge,
  Dropdown,
  FloatButton,
  Layout,
  Skeleton,
  Space,
  Tooltip,
} from "antd";
import React, { useState, Suspense, memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  BellOutlined,
  GithubOutlined,
  LockOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import { usePreferencesStore } from "@/stores/store";
import FullScreen from "./component/FullScreen";
import MessageBox from "./component/MessageBox";
import UserDropdown from "./component/UserDropdown";
import SearchMenuModal from "./component/SearchMenuModal";
import CollapseSwitch from "./component/CollapseSwitch";
import LanguageSwitch from "./component/LanguageSwitch";
import BreadcrumbNavWrapper from "./component/BreadcrumbNavWrapper";
import HeaderMenu from "./component/HeaderMenu";

const Setting = React.lazy(() => import("./component/Setting"));

/**
 * 顶部布局内容
 */
const Header = () => {
  const [openSetting, setOpenSetting] = useState<boolean>(false);
  // 只获取更新配置的函数
  // 这样可以避免在组件中使用usePreferencesStore时，导致组件重新
  const updatePreferences = usePreferencesStore(
    (state) => state.updatePreferences
  );
  // 获取配置是否开启头部
  // 这样可以避免在组件中使用usePreferencesStore时，导致组件重新
  const headerEnable = usePreferencesStore(
    (state) => state.preferences.header.enable
  );
  const { t } = useTranslation();

  /**
   * 跳转到github
   */
  const routeGitHub = useCallback(() => {
    window.open("https://github.com/yecongling/nexus-web", "_blank");
  }, []);

  return (
    <>
      {headerEnable ? (
        <Layout.Header
          className="ant-layout-header flex items-center"
          style={{
            borderBottom: " 1px solid #e9edf0",
          }}
        >
          {/* 侧边栏切换按钮 */}
          <CollapseSwitch />
          {/* 面包屑 */}
          <BreadcrumbNavWrapper />
          {/* 显示头部横向的菜单 */}
          <HeaderMenu />
          <Space size="large" className="flex justify-end items-center toolbox">
            <SearchMenuModal />
            <Tooltip placement="bottom" title="github">
              <GithubOutlined
                style={{ cursor: "pointer", fontSize: "18px" }}
                onClick={routeGitHub}
              />
            </Tooltip>
            <Tooltip placement="bottom" title={t("layout.header.lock")}>
              <LockOutlined
                style={{ cursor: "pointer", fontSize: "18px" }}
                onClick={() => {
                  updatePreferences("widget", "lockScreenStatus", true);
                }}
              />
            </Tooltip>
            {/* 邮件 */}
            <Badge count={5}>
              <MailOutlined style={{ cursor: "pointer", fontSize: "18px" }} />
            </Badge>
            <Dropdown placement="bottom" popupRender={() => <MessageBox />}>
              <Badge count={5}>
                <BellOutlined style={{ cursor: "pointer", fontSize: "18px" }} />
              </Badge>
            </Dropdown>
            <Tooltip placement="bottomRight" title={t("layout.header.setting")}>
              <SettingOutlined
                style={{ cursor: "pointer", fontSize: "18px" }}
                onClick={() => setOpenSetting(true)}
              />
            </Tooltip>
            <LanguageSwitch />
            <FullScreen />
            {/* 用户信息 */}
            <UserDropdown />
          </Space>
        </Layout.Header>
      ) : (
        <FloatButton
          icon={<SettingOutlined />}
          tooltip={<span>{t("layout.header.setting")}</span>}
          style={{ right: 24, bottom: 24 }}
          onClick={() => setOpenSetting(true)}
        />
      )}
      {/* 系统设置界面 */}
      <Suspense fallback={<Skeleton />}>
        <Setting open={openSetting} setOpen={setOpenSetting} />
      </Suspense>
    </>
  );
};
export default memo(Header);
