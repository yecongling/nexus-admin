import { Card, Col, Row } from 'antd';
import style from './endpointStatistics.module.scss';

const EndpointStatistics: React.FC = () => {
  return (
    <Row gutter={[24, 48]}>
      <Col span={8}>
        <Card className={style.cardBg} variant="borderless">
          <p>端点统计</p>
        </Card>
      </Col>
      <Col span={8}>
        <Card className={style.cardBg} variant="borderless">
          <p>端点统计</p>
        </Card>
      </Col>
      <Col span={8}>
        <Card className={style.cardBg} variant="borderless">
          <p>端点统计</p>
        </Card>
      </Col>
      <Col span={8}>
        <Card className={style.cardBg} variant="borderless">
          <p>端点统计</p>
        </Card>
      </Col>
      <Col span={8}>
        <Card className={style.cardBg} variant="borderless">
          <p>端点统计</p>
        </Card>
      </Col>
      <Col span={8}>
        <Card className={style.cardBg} variant="borderless">
          <p>端点统计</p>
        </Card>
      </Col>
    </Row>
  );
};
export default EndpointStatistics;
