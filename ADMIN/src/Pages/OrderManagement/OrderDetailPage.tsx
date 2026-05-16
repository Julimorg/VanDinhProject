import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button, Card, Col, Divider, Row, Spin, Table, Tag, Typography, Avatar, Space, Tooltip,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  ArrowLeftOutlined,
  PrinterOutlined,
  ShoppingOutlined,
  UserOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  InboxOutlined,
  IdcardOutlined,
  FileTextOutlined,
  BankOutlined,
  AppstoreOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { useGetOrderDetail } from './Hook/useGetOrderDetail';
import { IOrderItemDetail } from '@/Interface/Order/IGetOrderDetail';
import { formatToVietnamTime, formatCurrency } from '@/Utils/ulti';
import { usePrint } from '@/Hook/usePrint';

const { Title, Text } = Typography;

/* ─────────────── status / payment maps ─────────────── */

const STATUS_MAP: Record<string, {
  tagColor: string; dot: string; label: string; icon: React.ReactNode; badge: string;
}> = {
  Pending:   { tagColor: '#b45309', dot: '#f59e0b', label: 'Chờ xử lý',  icon: <ClockCircleOutlined />,  badge: '#fffbeb' },
  Approve:   { tagColor: '#065f46', dot: '#10b981', label: 'Đã duyệt',   icon: <CheckCircleOutlined />,  badge: '#ecfdf5' },
  Approved:  { tagColor: '#065f46', dot: '#10b981', label: 'Đã duyệt',   icon: <CheckCircleOutlined />,  badge: '#ecfdf5' },
  Cancelled: { tagColor: '#991b1b', dot: '#ef4444', label: 'Đã hủy',     icon: <CloseCircleOutlined />,  badge: '#fef2f2' },
};

const PAYMENT_MAP: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  CASH:    { label: 'Tiền mặt (COD)', color: '#065f46', bg: '#ecfdf5', icon: <DollarOutlined />     },
  VN_PAY:  { label: 'VNPAY',          color: '#1e40af', bg: '#eff6ff', icon: <BankOutlined />       },
  PAY_PAL: { label: 'PayPal',         color: '#6d28d9', bg: '#f5f3ff', icon: <CreditCardOutlined /> },
};

/* ─────────────── sub-components ─────────────── */

const SectionCard = ({
  icon, title, extra, children,
}: { icon: React.ReactNode; title: string; extra?: React.ReactNode; children: React.ReactNode }) => (
  <Card
    bordered={false}
    style={{ borderRadius: 16, border: '1px solid #e4e7ec', boxShadow: '0 1px 4px rgba(16,24,40,.06)', height: '100%' }}
    bodyStyle={{ padding: 0 }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid #f2f4f7' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, background: '#f2f4f7', color: '#667085', fontSize: 15 }}>
          {icon}
        </span>
        <Text style={{ fontWeight: 600, fontSize: 14, color: '#101828' }}>{title}</Text>
      </div>
      {extra}
    </div>
    {children}
  </Card>
);

const Field = ({
  label, icon, children, last = false,
}: { label: string; icon: React.ReactNode; children: React.ReactNode; last?: boolean }) => (
  <>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 24px' }}>
      <span style={{ color: '#98a2b3', fontSize: 16, marginTop: 1, flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#98a2b3', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 5 }}>{label}</div>
        {children}
      </div>
    </div>
    {!last && <Divider style={{ margin: '0 24px', width: 'auto', minWidth: 'auto', borderColor: '#f2f4f7' }} />}
  </>
);

const MetricCard = ({
  label, value, sub, icon, iconBg, iconColor, highlight,
}: { label: string; value: React.ReactNode; sub?: string; icon: React.ReactNode; iconBg: string; iconColor: string; highlight?: boolean }) => (
  <Card
    bordered={false}
    style={{ borderRadius: 14, border: `1px solid ${highlight ? '#d1fae5' : '#e4e7ec'}`, background: highlight ? '#f0fdf4' : '#fff', boxShadow: '0 1px 3px rgba(16,24,40,.05)', height: '100%' }}
    bodyStyle={{ padding: '20px 22px' }}
  >
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
      <Text style={{ fontSize: 12, fontWeight: 600, color: '#667085', textTransform: 'uppercase', letterSpacing: '0.5px', lineHeight: 1.4 }}>{label}</Text>
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: 10, background: iconBg, color: iconColor, fontSize: 18, flexShrink: 0 }}>
        {icon}
      </span>
    </div>
    <div style={{ fontSize: highlight ? 26 : 28, fontWeight: 800, color: highlight ? '#059669' : '#101828', lineHeight: 1.1, letterSpacing: '-0.5px' }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: '#98a2b3', marginTop: 6 }}>{sub}</div>}
  </Card>
);


const OrderDetailPage: React.FC = () => {
  const { orderId }     = useParams<{ orderId: string }>();
  const navigate        = useNavigate();
  const printRef        = useRef<HTMLDivElement>(null);
  const { handlePrint } = usePrint(printRef);

  const { data, isLoading, error } = useGetOrderDetail(orderId);
  const order      = data?.data;
  const orderItems: IOrderItemDetail[] = order?.items || [];
  const totalQty   = orderItems.reduce((s, i) => s + i.quantity, 0);
  const totalAmt   = orderItems.reduce((s, i) => s + i.productPrice * i.quantity, 0);

  if (error) console.error(error);

  const statusInfo  = order ? (STATUS_MAP[order.status] ?? { tagColor: '#344054', dot: '#667085', label: order.status, icon: <ClockCircleOutlined />, badge: '#f9fafb' }) : null;
  const paymentInfo = order?.paymentMethod ? (PAYMENT_MAP[order.paymentMethod] ?? { label: order.paymentMethod, color: '#344054', bg: '#f9fafb', icon: <CreditCardOutlined /> }) : null;

  /* table columns */
  const columns: ColumnsType<IOrderItemDetail> = [
    {
      title: '#',
      key: 'index',
      width: 52,
      align: 'center',
      render: (_, __, i) => (
        <Text style={{ fontSize: 13, color: '#98a2b3', fontWeight: 500 }}>{String(i + 1).padStart(2, '0')}</Text>
      ),
    },
    {
      title: 'Sản phẩm',
      key: 'product',
      render: (_, r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {r.productImage?.[0]
            ? <img src={r.productImage[0]} alt={r.productName} style={{ width: 52, height: 52, borderRadius: 10, objectFit: 'cover', border: '1px solid #f2f4f7', flexShrink: 0 }} />
            : <div style={{ width: 52, height: 52, borderRadius: 10, background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f2f4f7', flexShrink: 0 }}>
                <AppstoreOutlined style={{ fontSize: 20, color: '#d0d5dd' }} />
              </div>
          }
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#101828', marginBottom: 6, lineHeight: 1.3 }}>{r.productName}</div>
            <Space size={4} wrap>
              <Tag style={{ margin: 0, fontSize: 11, fontWeight: 500, border: '1px solid #e9d7fe', background: '#f9f5ff', color: '#7f56d9', borderRadius: 6, padding: '0 7px' }}>{r.colorName}</Tag>
              <Tag style={{ margin: 0, fontSize: 11, fontWeight: 500, border: '1px solid #b2ddff', background: '#eff8ff', color: '#1570ef', borderRadius: 6, padding: '0 7px' }}>{r.productVolume}</Tag>
              <Tag style={{ margin: 0, fontSize: 11, fontWeight: 500, border: '1px solid #abefc6', background: '#ecfdf3', color: '#067647', borderRadius: 6, padding: '0 7px' }}>{r.categoryName}</Tag>
            </Space>
            <div style={{ fontSize: 11, color: '#b0b8c8', marginTop: 5, fontFamily: 'monospace', letterSpacing: '0.3px' }}>{r.productCode}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'productPrice',
      key: 'price',
      width: 140,
      align: 'right',
      render: (v) => <Text style={{ fontSize: 14, color: '#344054', fontWeight: 500 }}>{formatCurrency(v)}</Text>,
    },
    {
      title: 'SL',
      dataIndex: 'quantity',
      key: 'qty',
      width: 80,
      align: 'center',
      render: (v) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 32, height: 28, borderRadius: 7, background: '#f2f4f7', border: '1px solid #e4e7ec', fontSize: 14, fontWeight: 700, color: '#344054', padding: '0 10px' }}>{v}</span>
      ),
    },
    {
      title: 'Thành tiền',
      key: 'subtotal',
      width: 150,
      align: 'right',
      render: (_, r) => (
        <Text style={{ fontSize: 15, fontWeight: 700, color: '#101828' }}>{formatCurrency(r.productPrice * r.quantity)}</Text>
      ),
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fc', padding: '28px 32px' }}>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>

        {/* ── Top bar ── */}
        <div className="print:hidden" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              style={{ height: 40, paddingInline: 18, fontWeight: 500, borderRadius: 10, border: '1px solid #d0d5dd', background: '#fff', fontSize: 14, color: '#344054', boxShadow: '0 1px 2px rgba(16,24,40,.05)' }}
            >
              Quay lại
            </Button>
            <div style={{ width: 1, height: 24, background: '#e4e7ec' }} />
            <span style={{ fontSize: 13, color: '#98a2b3' }}>Đơn hàng /</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#101828', fontFamily: 'monospace' }}>{order?.orderCode || orderId}</span>
          </div>
          {order && (
            <Button
              type="primary"
              icon={<PrinterOutlined />}
              onClick={handlePrint}
              style={{ height: 40, paddingInline: 20, fontWeight: 600, borderRadius: 10, background: '#101828', borderColor: '#101828', fontSize: 14, boxShadow: '0 1px 2px rgba(16,24,40,.1)' }}
            >
              In hóa đơn
            </Button>
          )}
        </div>

        <Spin spinning={isLoading} size="large">
          {order ? (
            <div ref={printRef} id="printable">

              {/* ── ORDER HERO HEADER ── */}
              <Card
                bordered={false}
                className="print:hidden"
                style={{ borderRadius: 16, border: '1px solid #e4e7ec', boxShadow: '0 1px 4px rgba(16,24,40,.06)', marginBottom: 20, overflow: 'hidden' }}
                bodyStyle={{ padding: 0 }}
              >
                {/* Accent bar */}
                <div style={{ height: 4, background: 'linear-gradient(90deg, #101828 0%, #344054 50%, #667085 100%)' }} />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, padding: '24px 28px' }}>
                  {/* Left: order identity */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 13, background: '#101828', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FileTextOutlined style={{ fontSize: 22, color: '#fff' }} />
                    </div>
                    <div>
                      <Title level={4} style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#101828', letterSpacing: '-0.3px' }}>
                        Chi tiết đơn hàng
                      </Title>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                        <Tooltip title="Sao chép mã đơn">
                          <span
                            style={{ fontFamily: 'monospace', fontSize: 13, padding: '3px 10px', borderRadius: 7, background: '#f2f4f7', border: '1px solid #e4e7ec', color: '#344054', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
                            onClick={() => navigator.clipboard.writeText(order.orderCode)}
                          >
                            {order.orderCode}
                            <CopyOutlined style={{ fontSize: 11, color: '#98a2b3' }} />
                          </span>
                        </Tooltip>
                        {statusInfo && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: statusInfo.badge, color: statusInfo.tagColor, border: `1px solid ${statusInfo.dot}30` }}>
                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: statusInfo.dot, flexShrink: 0 }} />
                            {statusInfo.label}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: timestamps */}
                  <div style={{ display: 'flex', gap: 32 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#98a2b3', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 4 }}>Ngày tạo</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#344054' }}>{formatToVietnamTime(order.createAt)}</div>
                    </div>
                    <div style={{ width: 1, background: '#f2f4f7' }} />
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#98a2b3', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 4 }}>Cập nhật</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#344054' }}>{formatToVietnamTime(order.updateAt)}</div>
                    </div>
                    <div style={{ width: 1, background: '#f2f4f7' }} />
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#98a2b3', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 4 }}>Tạo bởi</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#344054' }}>{order.createBy || 'Admin'}</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* ── METRICS ROW ── */}
              <Row gutter={[14, 14]} style={{ marginBottom: 20 }} className="print:hidden">
                <Col xs={24} sm={12} md={8} lg={6}>
                  <MetricCard
                    label="Tổng thanh toán"
                    value={formatCurrency(order.amount)}
                    icon={<DollarOutlined />}
                    iconBg="#d1fae5"
                    iconColor="#059669"
                    highlight
                  />
                </Col>
                <Col xs={12} sm={6} md={4} lg={4}>
                  <MetricCard
                    label="Sản phẩm"
                    value={orderItems.length}
                    sub="loại"
                    icon={<AppstoreOutlined />}
                    iconBg="#eff8ff"
                    iconColor="#1570ef"
                  />
                </Col>
                <Col xs={12} sm={6} md={4} lg={4}>
                  <MetricCard
                    label="Tổng số lượng"
                    value={totalQty}
                    sub="đơn vị"
                    icon={<InboxOutlined />}
                    iconBg="#fffbeb"
                    iconColor="#b45309"
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={5}>
                  <MetricCard
                    label="Thanh toán"
                    value={<span style={{ fontSize: 16, fontWeight: 700, color: paymentInfo?.color || '#344054' }}>{paymentInfo?.label || '—'}</span>}
                    icon={paymentInfo?.icon || <CreditCardOutlined />}
                    iconBg={paymentInfo?.bg || '#f9fafb'}
                    iconColor={paymentInfo?.color || '#667085'}
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={5}>
                  <MetricCard
                    label="Trạng thái đơn"
                    value={statusInfo ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 16, fontWeight: 700, color: statusInfo.tagColor }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: statusInfo.dot, flexShrink: 0 }} />
                        {statusInfo.label}
                      </span>
                    ) : '—'}
                    icon={statusInfo?.icon || <CheckCircleOutlined />}
                    iconBg={statusInfo?.badge || '#f9fafb'}
                    iconColor={statusInfo?.tagColor || '#667085'}
                  />
                </Col>
              </Row>

              {/* ── INFO CARDS ── */}
              <Row gutter={[20, 20]} style={{ marginBottom: 20 }} className="print:hidden">

                {/* Order Info */}
                <Col xs={24} lg={12}>
                  <SectionCard icon={<FileTextOutlined />} title="Thông tin đơn hàng">
                    <Field icon={<ShoppingOutlined />} label="Mã đơn hàng">
                      <span style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 700, color: '#101828' }}>{order.orderCode}</span>
                    </Field>
                    <Field icon={<CheckCircleOutlined />} label="Trạng thái">
                      {statusInfo && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, padding: '5px 13px', borderRadius: 20, background: statusInfo.badge, color: statusInfo.tagColor }}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: statusInfo.dot }} />
                          {statusInfo.label}
                        </span>
                      )}
                    </Field>
                    <Field icon={<CalendarOutlined />} label="Ngày tạo">
                      <Text style={{ fontSize: 14, color: '#344054', fontWeight: 500 }}>{formatToVietnamTime(order.createAt)}</Text>
                    </Field>
                    <Field icon={<CalendarOutlined />} label="Cập nhật lần cuối">
                      <Text style={{ fontSize: 14, color: '#344054', fontWeight: 500 }}>{formatToVietnamTime(order.updateAt)}</Text>
                    </Field>
                    <Field icon={<EnvironmentOutlined />} label="Địa chỉ giao hàng">
                      <Text style={{ fontSize: 14, color: '#344054', lineHeight: 1.6 }}>{order.shipAddress || '—'}</Text>
                    </Field>
                    <Field icon={paymentInfo?.icon || <CreditCardOutlined />} label="Phương thức thanh toán" last>
                      {paymentInfo && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 14, fontWeight: 600, color: paymentInfo.color, padding: '5px 13px', background: paymentInfo.bg, borderRadius: 8, border: `1px solid ${paymentInfo.color}25` }}>
                          {paymentInfo.icon}
                          {paymentInfo.label}
                        </span>
                      )}
                    </Field>
                  </SectionCard>
                </Col>

                {/* Customer Info */}
                <Col xs={24} lg={12}>
                  <SectionCard icon={<UserOutlined />} title="Thông tin khách hàng">
                    {/* Customer hero */}
                    <div style={{ margin: '16px 24px 6px', padding: '18px 20px', borderRadius: 12, background: '#f8f9fc', border: '1px solid #f2f4f7', display: 'flex', alignItems: 'center', gap: 16 }}>
                      <Avatar
                        size={58}
                        style={{ background: '#101828', fontSize: 24, fontWeight: 700, flexShrink: 0, letterSpacing: '-0.5px' }}
                      >
                        {order.userName?.charAt(0)?.toUpperCase() || 'U'}
                      </Avatar>
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: '#101828', letterSpacing: '-0.2px' }}>{order.userName}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5 }}>
                          <IdcardOutlined style={{ fontSize: 12, color: '#98a2b3' }} />
                          <Text style={{ fontSize: 12, color: '#98a2b3', fontFamily: 'monospace' }}>
                            {order.userId?.slice(0, 18)}…
                          </Text>
                        </div>
                      </div>
                    </div>

                    <Field icon={<MailOutlined />} label="Email">
                      <Text copyable={{ tooltips: ['Sao chép', 'Đã sao chép!'] }} style={{ fontSize: 14, color: '#1570ef', fontWeight: 500 }}>{order.email}</Text>
                    </Field>
                    <Field icon={<PhoneOutlined />} label="Số điện thoại">
                      <Text copyable={{ tooltips: ['Sao chép', 'Đã sao chép!'] }} style={{ fontSize: 15, color: '#101828', fontWeight: 600 }}>{order.phone}</Text>
                    </Field>
                    <Field icon={<HomeOutlined />} label="Địa chỉ khách hàng" last>
                      <Text style={{ fontSize: 14, color: '#344054', lineHeight: 1.6 }}>{order.userAddress || '—'}</Text>
                    </Field>
                  </SectionCard>
                </Col>
              </Row>

              {/* ── PRODUCT TABLE ── */}
              <Card
                bordered={false}
                className="print:hidden"
                style={{ borderRadius: 16, border: '1px solid #e4e7ec', boxShadow: '0 1px 4px rgba(16,24,40,.06)', overflow: 'hidden' }}
                bodyStyle={{ padding: 0 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid #f2f4f7' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, background: '#f2f4f7', color: '#667085', fontSize: 15 }}>
                      <ShoppingOutlined />
                    </span>
                    <Text style={{ fontWeight: 600, fontSize: 14, color: '#101828' }}>Danh sách sản phẩm</Text>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: '#f2f4f7', border: '1px solid #e4e7ec', color: '#667085' }}>
                    {orderItems.length} sản phẩm · {totalQty} đơn vị
                  </span>
                </div>

                <Table
                  columns={columns}
                  dataSource={orderItems}
                  rowKey="orderItemId"
                  pagination={false}
                  scroll={{ x: 700 }}
                  style={{ borderRadius: '0 0 16px 16px' }}
                  summary={() => (
                    <Table.Summary>
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0} colSpan={3}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 8 }}>
                            <Text style={{ fontSize: 13, color: '#667085' }}>
                              Tổng số lượng: <strong style={{ color: '#344054' }}>{totalQty} sản phẩm</strong>
                            </Text>
                          </div>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={3} align="center">
                          <Text strong style={{ fontSize: 15, color: '#101828' }}>{totalQty}</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={4} align="right">
                          <div style={{ padding: '6px 0' }}>
                            <div style={{ fontSize: 11, fontWeight: 600, color: '#98a2b3', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Tổng thanh toán</div>
                            <div style={{ fontSize: 22, fontWeight: 800, color: '#059669', letterSpacing: '-0.5px' }}>{formatCurrency(order.amount)}</div>
                          </div>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </Table.Summary>
                  )}
                />
              </Card>

              {/* ── PRINT LAYOUT ── */}
              <div className="hidden print:block" style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', lineHeight: 1.4, maxWidth: '600px', margin: '0 auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid #000' }}>
                  <tbody>
                    <tr><td colSpan={4} style={{ textAlign: 'center', border: '1px solid #000', padding: '8px', fontSize: '16px', fontWeight: 'bold' }}>HÓA ĐƠN BÁN HÀNG</td></tr>
                    <tr><td colSpan={4} style={{ textAlign: 'center', border: '1px solid #000', padding: '4px', fontSize: '10px' }}>Công ty TNHH ABC Shop · 123 Đường ABC, TP.HCM · 0123456789 · info@abcshop.vn</td></tr>
                  </tbody>
                </table>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginTop: '4px' }}>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '4px 6px', width: '20%' }}>Mã đơn:</td>
                      <td style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold', width: '30%' }}>{order.orderCode}</td>
                      <td style={{ border: '1px solid #000', padding: '4px 6px', width: '20%' }}>Ngày:</td>
                      <td style={{ border: '1px solid #000', padding: '4px 6px' }}>{formatToVietnamTime(order.createAt)}</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '4px 6px' }}>Trạng thái:</td>
                      <td style={{ border: '1px solid #000', padding: '4px 6px' }}>{statusInfo?.label || order.status}</td>
                      <td style={{ border: '1px solid #000', padding: '4px 6px' }}>Khách hàng:</td>
                      <td style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold' }}>{order.userName}</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '4px 6px' }}>SĐT / Email:</td>
                      <td colSpan={3} style={{ border: '1px solid #000', padding: '4px 6px' }}>{order.phone} · {order.email}</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '4px 6px' }}>Địa chỉ:</td>
                      <td colSpan={3} style={{ border: '1px solid #000', padding: '4px 6px', fontSize: '10px' }}>{order.userAddress} | Giao: {order.shipAddress}</td>
                    </tr>
                  </tbody>
                </table>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginTop: '4px' }}>
                  <thead>
                    <tr style={{ background: '#eee' }}>
                      {['STT', 'Tên sản phẩm', 'ĐVT', 'SL', 'Đơn giá', 'Thành tiền'].map((h, i) => (
                        <th key={i} style={{ border: '1px solid #000', padding: '4px 6px', fontSize: '10px', textAlign: i >= 3 ? 'center' : 'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item, i) => (
                      <tr key={item.orderItemId}>
                        <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>{i + 1}</td>
                        <td style={{ border: '1px solid #000', padding: '4px 6px' }}>{item.productName}</td>
                        <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>{item.productUnit || 'Cái'}</td>
                        <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'center' }}>{item.quantity}</td>
                        <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'right' }}>{formatCurrency(item.productPrice)}</td>
                        <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'right' }}>{formatCurrency(item.productPrice * item.quantity)}</td>
                      </tr>
                    ))}
                    {Array.from({ length: Math.max(0, 5 - orderItems.length) }).map((_, i) => (
                      <tr key={`e-${i}`}>{Array.from({ length: 6 }).map((__, j) => <td key={j} style={{ border: '1px solid #000', padding: '8px 6px' }}>&nbsp;</td>)}</tr>
                    ))}
                  </tbody>
                </table>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginTop: '4px' }}>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '4px 6px', width: '50%' }}>Thanh toán: {paymentInfo?.label}</td>
                      <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'right', fontWeight: 'bold', fontSize: '13px' }}>Tổng: {formatCurrency(order.amount)}</td>
                    </tr>
                  </tbody>
                </table>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid #000', marginTop: '4px' }}>
                  <tbody>
                    <tr>
                      {['Người nhận hàng', 'Người giao hàng', `Ngày: ${formatToVietnamTime(new Date().toISOString())}`].map((l, i) => (
                        <td key={i} style={{ border: '1px solid #000', padding: '32px 6px 8px', textAlign: 'center', fontSize: '11px', width: '33%' }}>{l}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          ) : !isLoading && (
            <Card bordered={false} style={{ borderRadius: 16, textAlign: 'center', padding: '80px 0', border: '1px solid #e4e7ec', boxShadow: '0 1px 4px rgba(16,24,40,.06)' }}>
              <Space direction="vertical" size="large" style={{ alignItems: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: '#f2f4f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🔍</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#101828', marginBottom: 6 }}>Không tìm thấy đơn hàng</div>
                  <Text style={{ color: '#667085', fontSize: 14 }}>Đơn hàng không tồn tại hoặc đã xảy ra lỗi.</Text>
                </div>
                <Button type="primary" size="large" onClick={() => navigate(-1)} style={{ borderRadius: 10, height: 44, paddingInline: 24, background: '#101828', borderColor: '#101828', fontWeight: 600 }}>Quay lại</Button>
              </Space>
            </Card>
          )}
        </Spin>
      </div>

      <style>{`
        .ant-table-thead > tr > th {
          background: #f9fafb !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          color: #667085 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
          padding: 13px 18px !important;
          border-bottom: 1px solid #f2f4f7 !important;
        }
        .ant-table-tbody > tr > td {
          padding: 16px 18px !important;
          border-bottom: 1px solid #f9fafb !important;
          vertical-align: middle !important;
        }
        .ant-table-tbody > tr:hover > td {
          background: #fafafa !important;
        }
        .ant-table-summary > tr > td {
          background: #f9fafb !important;
          padding: 16px 18px !important;
          border-top: 1px solid #f2f4f7 !important;
        }
        .ant-table-container table > thead > tr:first-child th:first-child { border-top-left-radius: 0 !important; }
        .ant-table-container table > thead > tr:first-child th:last-child { border-top-right-radius: 0 !important; }
        @media print {
          body * { visibility: hidden; }
          #printable, #printable * { visibility: visible; }
          #printable { position: absolute; left: 0; top: 0; width: 100%; max-width: 600px; margin: 0 auto; }
          .print\\:hidden { display: none !important; }
          .hidden.print\\:block { display: block !important; }
          @page { size: A4 portrait; margin: 1cm; }
        }
      `}</style>
    </div>
  );
};

export default OrderDetailPage;