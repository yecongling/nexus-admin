import { memo } from 'react';
import { Image } from 'antd';
import { Link } from 'react-router';
import logo from '@/assets/images/icon-192.png';
import { usePreferencesStore } from '@/stores/store';

/**
 * 系统logo
 * @returns
 */
const SystemLogo = () => {
  const colorPrimary = usePreferencesStore((state) => state.preferences.theme.colorPrimary);

  return (
    <div className="flex justify-between items-center toolbox">
      <Link to="/" style={{ width: '100%' }}>
        <section className="system-logo h-16 flex items-center shrink-0 box-border">
          <Image
            width={32}
            height={32}
            className="rounded-s-md transition-all duration-200 overflow-hidden shrink-0"
            src={logo}
            preview={false}
          />
          <span className="system-name" style={{ color: colorPrimary }}>
            Nexus Admin
          </span>
        </section>
      </Link>
    </div>
  );
};

export default memo(SystemLogo);