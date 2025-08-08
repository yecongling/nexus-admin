import { Input, type InputRef } from "antd";
import favicon from "@/assets/images/icon-512.png";
import type React from "react";
import { useCallback, useEffect, useRef } from "react";
import style from "./screenLock.module.scss";
import { usePreferencesStore } from "@/stores/store";
import { useShallow } from "zustand/shallow";

/**
 * 锁屏操作
 * @returns
 */
const ScreenLock: React.FC = () => {
  // 状态
  const { lockScreenStatus, updatePreferences } = usePreferencesStore(
    useShallow((state) => ({
      lockScreenStatus: state.preferences.widget.lockScreenStatus,
      updatePreferences: state.updatePreferences,
    })),
  );
  const pwdRef = useRef<InputRef>(null);

  // 页面锁屏时，聚焦到密码框
  useEffect(() => {
    if (lockScreenStatus) {
      pwdRef.current?.focus();
    }
  }, [lockScreenStatus]);

  /**
   * 验证解锁密码
   */
  const validatePassword = useCallback(() => {
    updatePreferences("widget", "lockScreenStatus", false);
  }, [updatePreferences]);

  return lockScreenStatus ? (
    <div className={style["screen-lock"]}>
      <div className="screen-lock-content">
        <div className="screen-lock-title">
          <img src={favicon} alt="" width={100} />
          <span>系统锁屏</span>
        </div>
        <div className="screen-lock-input">
          <Input.Password
            ref={pwdRef}
            placeholder="请输入密码"
            onPressEnter={validatePassword}
          />
        </div>
      </div>
    </div>
  ) : null;
};

export default ScreenLock;
