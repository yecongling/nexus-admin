import { ColorPicker } from "antd";
import type { Color } from "antd/es/color-picker";
import { UserAddOutlined } from "@ant-design/icons";
import clsx from "clsx";
import { BUILTIN_THEME_PRESETS } from "@/enums/constants";
import "./theme.scss";
import { usePreferencesStore } from "@/stores/store";
import { useShallow } from "zustand/shallow";
import { useCallback } from "react";

/**
 * 内置主题
 * @returns
 */
const Buitin: React.FC = () => {
  // 属性变动
  const { colorPrimary, updatePreferences } = usePreferencesStore(
    useShallow((state) => ({
      colorPrimary: state.preferences.theme.colorPrimary,
      updatePreferences: state.updatePreferences,
    }))
  );

  // 颜色选择器颜色切换
  const onColorChange = useCallback(
    (color: Color) => {
      updatePreferences("theme", "colorPrimary", color.toCssString());
    },
    [updatePreferences]
  );

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}
    >
      {BUILTIN_THEME_PRESETS.map((item) => {
        return (
          <div
            key={item.color}
            style={{
              display: "flex",
              flexDirection: "column",
              cursor: "pointer",
            }}
            onClick={() => {
              if (item.type === "custom") {
                return;
              }
              updatePreferences("theme", "colorPrimary", item.color);
            }}
          >
            <div
              className={clsx("outline-box", {
                "outline-box-active": colorPrimary === item.color,
              })}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              {item.type === "custom" ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    padding: "0.5rem 2.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      width: "1.25rem",
                      height: "1.25rem",
                      borderRadius: "6px",
                    }}
                  >
                    <ColorPicker
                      onChangeComplete={onColorChange}
                      value={colorPrimary}
                    >
                      <UserAddOutlined style={{ fontSize: "1.25rem" }} />
                    </ColorPicker>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    backgroundColor: item.color,
                    width: "1.25rem",
                    height: "1.25rem",
                    margin: "0.5rem 2.5rem",
                    borderRadius: "6px",
                  }}
                />
              )}
            </div>
            <div
              style={{
                fontSize: ".75rem",
                lineHeight: "1rem",
                textAlign: "center",
                margin: ".5rem 0",
                color: "rgb(113, 113, 122)",
              }}
            >
              {item.type}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Buitin;
