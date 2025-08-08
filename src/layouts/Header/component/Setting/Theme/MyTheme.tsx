import clsx from "clsx";
import { THEME_PRESET } from "@/enums/constants";
import { usePreferencesStore } from "@/stores/store";
import "./theme.scss";
import SwitchItem from "../SwitchItem";
import { useShallow } from "zustand/shallow";

/**
 * 主题
 * @returns
 */
const MyTheme: React.FC = () => {
  const { mode, updatePreferences } = usePreferencesStore(
    useShallow((state) => ({
      mode: state.preferences.theme.mode,
      updatePreferences: state.updatePreferences,
    }))
  );
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        justifyContent: "space-between",
        flexWrap: "wrap",
      }}
    >
      {THEME_PRESET.map((item) => {
        return (
          <div
            key={item.name}
            style={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                cursor: "pointer",
                flexDirection: "column",
              }}
              onClick={() => {
                updatePreferences("theme", "mode", item.name);
              }}
            >
              <div
                className={clsx("outline-box", {
                  "outline-box-active": item.name === mode,
                })}
                style={{ paddingTop: "1rem", paddingBottom: "1rem" }}
              >
                {item.icon}
              </div>
              <div
                style={{
                  textAlign: "center",
                  fontSize: "12px",
                  lineHeight: "16px",
                  color: "rgb(113, 113, 122)",
                  marginTop: "8px",
                }}
              >
                {item.name}
              </div>
            </div>
          </div>
        );
      })}
      {/* 深色侧边栏 */}
      <SwitchItem
        style={{ marginTop: "1.5rem" }}
        title="深色侧边栏"
        category="theme"
        disabled={false}
        pKey="semiDarkSidebar"
      />
      {/* 深色顶栏 */}
      <SwitchItem
        disabled
        title="深色顶栏"
        category="theme"
        pKey="semiDarkHeader"
      />
    </div>
  );
};
export default MyTheme;
