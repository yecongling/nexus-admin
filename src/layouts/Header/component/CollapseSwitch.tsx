import { usePreferencesStore } from "@/stores/store";
import { Button } from "antd";
import { memo } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

const CollapseSwitch: React.FC = () => {
  // 从全局状态中获取配置是否开启面包屑、图标
  const { preferences, updatePreferences } = usePreferencesStore();
  const { sidebar } = preferences;
  const { collapsed } = sidebar;
  return (
    <Button
      size="small"
      color="default"
      variant="filled"
      shape="circle"
      style={{
        cursor: "pointer",
        fontSize: "16px",
        marginLeft: "6px",
      }}
      icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      onClick={() => updatePreferences("sidebar", "collapsed", !collapsed)}
    />
  );
};

export default memo(CollapseSwitch);
