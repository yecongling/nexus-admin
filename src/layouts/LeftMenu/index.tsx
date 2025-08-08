import type React from "react";
import { memo, useMemo } from "react";
import { Layout } from "antd";

import "./leftMenu.scss";
import { usePreferencesStore } from "@/stores/store";
import SystemLogo from "./component/SystemLogo";
import MenuComponent from "./component/MenuComponent";
import { useShallow } from "zustand/shallow";

/**
 * 左边的菜单栏
 */
const LeftMenu: React.FC = () => {
  // 优化 1: 使用 shallow 避免不必要的重渲染
  const { sidebar, mode, semiDarkSidebar } = usePreferencesStore(
    useShallow((state) => ({
      sidebar: state.preferences.sidebar,
      mode: state.preferences.theme.mode,
      semiDarkSidebar: state.preferences.theme.semiDarkSidebar,
    }))
  );

  // 优化 2: 使用 useMemo 缓存派生的 mode 值
  const finalMode = useMemo(() => {
    let currentMode = mode;
    if (currentMode === "auto") {
      // 检查 window 对象是否存在，以兼容 SSR (服务端渲染)
      const isDarkMode =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      currentMode = isDarkMode ? "dark" : "light";
    }
    if (semiDarkSidebar) {
      currentMode = "dark";
    }
    return currentMode;
  }, [mode, semiDarkSidebar]); // 依赖项是 theme 的相关属性

  return (
    <Layout.Sider
      trigger={null}
      collapsedWidth={48}
      className="ant-menu"
      style={{
        overflow: "hidden",
        position: "relative",
        transition: "width .2s cubic-bezier(.34,.69,.1,1)",
        zIndex: 999,
        boxShadow: "0 2px 5px #00000014",
      }}
      collapsible
      width={sidebar.width}
      theme={finalMode}
      collapsed={sidebar.collapsed}
    >
      <SystemLogo />
      <MenuComponent />
    </Layout.Sider>
  );
};

export default memo(LeftMenu);
