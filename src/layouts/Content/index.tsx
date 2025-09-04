import { Layout, Skeleton } from "antd";
import type React from "react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet, useLocation } from "react-router";
import AuthRouter from "@/router/AuthRouter";
import { ErrorFallback } from "@/router/ErrorBoundary";
import KeepAlive from "@/components/KeepAlive";

/**
 * 中间主内容区域
 * @returns
 */
const Content: React.FC = () => {
  // 错误边界加key的目的是为了每次路由切换的时候都重新渲染错误边界，避免切换到新的路由的时候不会重新渲染
  const location = useLocation();
  return (
    <Layout.Content
      className="p-4"
    >
      <Suspense fallback={<Skeleton />}>
        <ErrorBoundary key={location.pathname} fallback={<ErrorFallback />}>
          <AuthRouter>
            <KeepAlive>
              <Outlet />
            </KeepAlive>
          </AuthRouter>
        </ErrorBoundary>
      </Suspense>
    </Layout.Content>
  );
};
export default Content;
