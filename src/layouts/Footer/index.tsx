import filing from '@/assets/images/filing.png';
import { usePreferencesStore } from '@/stores/store';
/**
 * 底栏组件，显示版权信息
 * @returns 底栏组件
 */
const Footer: React.FC = () => {

    const { enable, fixed} = usePreferencesStore((state) => state.preferences.footer)
    const { date, icp, icpLink } = usePreferencesStore((state) => state.preferences.copyright);
    if (!enable) {
      return null;
    }

    const footerClassName = fixed ? 'fixed bottom-0 left-0 right-0' : 'bottom-0 left-0 right-0';

  return (
    <div className={`flex flex-row justify-center items-center my-0 mx-auto py-2 px-0 ${footerClassName}`}>
        <p className="text-center mr-2">Copyright@{date} 499475142@qq.com All Rights Reserved</p>
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
          href={icpLink}
          target="_blank"
          rel="noreferrer"
          className="absolute inline-block text-[#939393]! text-decoration-none ml-1.5"
        >
          {icp}
        </a>
      </div>
  );
};
export default Footer;