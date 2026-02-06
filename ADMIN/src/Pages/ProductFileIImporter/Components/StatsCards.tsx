import { Row, Col, Card, Statistic } from 'antd';
import { FileExcelOutlined, HistoryOutlined, CheckCircleOutlined } from '@ant-design/icons';

interface Stats {
  totalProducts: number;
  lastImport: string;
  successRate: number;
}

interface Props {
  stats: Stats;
}

export default function StatsCards({ stats }: Props) {
  return (
    <Row gutter={[16, 16]} className="mb-6">
      <Col xs={24} sm={8}>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <Statistic
            title="Tổng sản phẩm"
            value={stats.totalProducts}
            valueStyle={{ color: '#1890ff', fontSize: '24px' }}
            prefix={<FileExcelOutlined />}
          />
        </Card>
      </Col>
      <Col xs={12} sm={8}>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <Statistic
            title="Lần nhập cuối"
            value={stats.lastImport}
            valueStyle={{ color: '#52c41a', fontSize: '20px' }}
            prefix={<HistoryOutlined />}
          />
        </Card>
      </Col>
      <Col xs={12} sm={8}>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <Statistic
            title="Tỷ lệ thành công"
            value={stats.successRate}
            suffix="%"
            precision={1}
            valueStyle={{ color: '#52c41a', fontSize: '24px' }}
            prefix={<CheckCircleOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
}