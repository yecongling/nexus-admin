import type React from 'react';
import { useRef, useState } from 'react';
import { Button, Checkbox, Col, Form, Image, Input, Row } from 'antd';
import logo from '@/assets/images/icon-512.png';
import { LockOutlined, SecurityScanOutlined, UserOutlined } from '@ant-design/icons';
import styles from './login.module.scss';
import filing from '@/assets/images/filing.png';
import { useNavigate } from 'react-router';
import { loginService } from '@/services/login/loginApi';
// 一些公用的API需要提取出来到api目录下(后续进行更改)
import { HttpCodeEnum } from '@/enums/httpEnum';
import { antdUtils } from '@/utils/antdUtil';
import { useMenuStore } from '@/stores/store';
import { useQuery } from '@tanstack/react-query';
import { commonService } from '@/services/common';
import { useUserStore } from '@/stores/userStore';
import { useTranslation } from 'react-i18next';

/**
 * 登录模块
 * @returns 组件内容
 */
const Login: React.FC = () => {
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { setMenus } = useMenuStore();
  const userStore = useUserStore();
  const { t } = useTranslation();
  // 加载状态
  const [loading, setLoading] = useState<boolean>(false);
  // 验证码
  const { data, refetch } = useQuery<{ key: string; code: any }>({
    queryKey: ['getCode'],
    queryFn: loginService.getCaptcha,
  });

  /**
   * 登录表单提交
   * @param values 提交表单的数据
   */
  const submit = async (values: any) => {
    // 加入验证码校验key
    values.checkKey = data?.key;
    setLoading(true);
    // 这里考虑返回的内容不仅包括token，还包括用户登录的角色（需要存储在本地，用于刷新页面时重新根据角色获取菜单）、配置的首页地址（供登录后进行跳转）
    try {
      const { code, data, message } = await loginService.login(values);

      // 根据code判定登录状态（和枚举的状态码进行判定） 只会存在几种情况，用户名不存在，用户名或密码错误，用户名冻结，验证码错误或者过期
      // case中使用{}包裹的目的是为了保证变量做用于仅限于case块
      switch (code) {
        // 用户名不存在或禁用
        case HttpCodeEnum.RC107:
        case HttpCodeEnum.RC102:
          form.setFields([{ name: 'username', errors: [message] }]);
          form.getFieldInstance('username').focus();
          // 刷新验证码
          refetch();
          break;
        // 密码输入错误
        case HttpCodeEnum.RC108:
          form.setFields([{ name: 'password', errors: [message] }]);
          form.getFieldInstance('password').focus();
          // 刷新验证码
          refetch();
          break;
        // 验证码错误或过期
        case HttpCodeEnum.RC300:
        case HttpCodeEnum.RC301:
          form.setFields([{ name: 'captcha', errors: [message] }]);
          form.getFieldInstance('captcha').focus();
          // 刷新验证码
          refetch();
          break;
        // 登录失败次数过多
        case HttpCodeEnum.RC111:
          antdUtils.message?.error({
            content: <p>{message}</p>,
          });
          break;
        // 登录成功
        case HttpCodeEnum.SUCCESS:
          {
            // 没有配置首页地址默认跳到第一个菜单
            const { accessToken, refreshToken, roleId } = data;

            userStore.login(values.username, accessToken, refreshToken, roleId);
            let { homePath } = data;
            // 登录成功根据角色获取菜单
            const menu = await commonService.getMenuListByRoleId(roleId, accessToken);
            setMenus(menu);
            // 判断是否配置了默认跳转的首页地址
            if (!homePath) {
              // 获取第一个是路由的地址
              const firstRoute = findMenuByRoute(menu);
              if (firstRoute) {
                homePath = (firstRoute as any).path;
              } else {
                // 没有配置默认首页地址，也没有菜单，则提示错误
                antdUtils.notification?.error({
                  message: t('login.loginFail'),
                  description: '没有配置默认首页地址，也没有菜单，请联系管理员！',
                });
                return;
              }
            }
            userStore.setHomePath(homePath);
            antdUtils.notification?.success({
              message: t('login.loginSuccess'),
              description: t('login.welcome'),
            });
            // 跳转到首页
            navigate(homePath);
          }
          break;
        default:
          // 默认按登录失败处理
          antdUtils.modal?.error({
            title: t('login.loginFail'),
            content: (
              <>
                <p>
                  {t('common.statusCode')}:{code}
                </p>
                <p>
                  {t('common.reason')}:{message}
                </p>
              </>
            ),
          });
          // 刷新验证码
          refetch();
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * 刷新验证码
   */
  const refreshCaptcha = () => {
    refetch();
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* 标题 */}
      <div className="h-[80px] flex items-center ml-40">
        <div className="flex items-center">
          <img className="login-icon my-0" width="40" src={logo} alt="logo" />
          <span
            className="ml-5 text-3xl text-[#000000]"
            style={{
              fontFamily: '微软雅黑 Bold, 微软雅黑 Regular, 微软雅黑, sans-serif',
              fontWeight: 700,
            }}
          >
            {t('common.app.name')}
          </span>
        </div>
      </div>
      <div className={styles['login-container']}>
        <div className={styles['login-box']}>
          {/* 左边图案和标题 */}
          <div className={styles['login-left']}>
            <div className="title mt-18">
              <p className="text-[24px] m-0 mb-2">
                <span
                  style={{
                    fontFamily: '微软雅黑 Bold, 微软雅黑 Regular, 微软雅黑, sans-serif',
                    fontWeight: 700,
                  }}
                >
                  {t('login.description')}
                </span>
              </p>
              <p className="text-[14px] mt-3 italic">FLEX AND STRONG</p>
            </div>
          </div>
          {/* 右边登陆表单 */}
          <div className={styles['login-form']}>
            <div className="login-title">
              <p className="text-[28px] text-center m-0">
                <span className="font-bold">{t('login.login')}</span>
              </p>
            </div>
            <div className="form" style={{ marginTop: '40px' }}>
              <Form form={form} name="login" labelCol={{ span: 5 }} size="large" autoComplete="off" onFinish={submit}>
                <Form.Item name="username" rules={[{ required: true, message: t('login.enterUsername') }]}>
                  <Input
                    size="large"
                    ref={inputRef}
                    autoFocus
                    autoComplete="off"
                    allowClear
                    placeholder={`${t('login.username')}:nexus`}
                    prefix={<UserOutlined />}
                  />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: t('login.enterPassword') }]}>
                  <Input.Password
                    size="large"
                    allowClear
                    autoComplete="off"
                    placeholder={`${t('login.password')}:123456`}
                    prefix={<LockOutlined />}
                  />
                </Form.Item>
                <Form.Item>
                  <Row gutter={8}>
                    <Col span={18}>
                      <Form.Item name="captcha" noStyle rules={[{ required: true, message: t('login.enterCaptcha') }]}>
                        <Input
                          size="large"
                          allowClear
                          placeholder={t('login.enterCaptcha')}
                          prefix={<SecurityScanOutlined />}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Button size="large" onClick={refreshCaptcha} className="w-full bg-[#f0f0f0] p-0.5!">
                        <Image src={data?.code} preview={false} width="100%" height="100%" />
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
                {/* 记住密码 */}
                <Form.Item name="remember" valuePropName="checked">
                  <Checkbox>{t('login.remember')}</Checkbox>
                </Form.Item>
                <Form.Item>
                  <Button loading={loading} size="large" className="w-full" type="primary" htmlType="submit">
                    {t('login.login')}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[440px] my-0 mx-auto py-[20px] px-0">
        <p className="text-center mb-2">Copyright@2025 499475142@qq.com All Rights Reserved</p>
        <a
          target="_blank"
          rel="noreferrer"
          href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=51012202001944"
          className="inline-block h-[20px] leading-5 text-decoration-none"
        >
          <img src={filing} className="float-left" alt="无图片" />
          <p className="float-left h-5 leading-5 m-[0_0_0_5px] text-[#939393]!">川公网安备51012202001944</p>
        </a>
        <a
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noreferrer"
          className="absolute inline-block text-[#939393]! text-decoration-none ml-1.5"
        >
          蜀ICP备2023022276号-2
        </a>
      </div>
    </div>
  );
};
export default Login;

/**
 * 递归查找菜单(返回第一个匹配的菜单)
 * @param menus 菜单数组
 * @param key 要查找的菜单的 key
 * @returns 找到的菜单对象或 null
 */
function findMenuByRoute(menus: any[]): any | null {
  for (const menu of menus) {
    if (menu.route) {
      return menu; // 找到匹配的菜单项
    }
    if (menu.children) {
      const found = findMenuByRoute(menu.children);
      if (found) return found; // 递归查找子菜单
    }
  }
  return null;
}
