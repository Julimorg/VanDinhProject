import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Descriptions, Space, Typography } from 'antd';
import { formatCurrency, formatToVietnamTime } from '@/Utils';
import { TicketDetailResponseData } from '@/Interface/TTicketDetail';
import { useGetTicketDetail } from './Hook/useGetTicketDetail';
import { useAuthStore } from '@/Store/auth';
import Loading from '@/Components/Loading';

const { Title, Text } = Typography;

interface TicketItem {
  ticketEle: string;
  hallmark: string;
  ticketType: string;
  ticketQuantity: number;
  ticketPrice: string;
}

const DetailTicketPage: React.FC = () => {
  const navigate = useNavigate();
  const { contractID } = useParams<{ contractID: string }>();
  const { data, isLoading } = useGetTicketDetail(contractID);
  const userName = useAuthStore((state) => state.userName);

  const ticket = Array.isArray(data) ? data[0] : data;
  console.log(ticket);

  if (!contractID || contractID.trim() === '') {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Card className="w-full max-w-md shadow-lg">
          <Space direction="vertical" align="center" size="large" className="w-full">
            <Text type="danger" strong className="text-lg">
              Lỗi: Mã giao dịch không hợp lệ
            </Text>
            <Button
              type="primary"
              size="large"
              style={{ backgroundColor: '#29A36A', borderColor: '#29A36A' }}
              onClick={() => navigate('/find-ticket')}
            >
              Quay về
            </Button>
          </Space>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loading />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Card className="w-full max-w-md shadow-lg">
          <Space direction="vertical" align="center" size="large" className="w-full">
            <Text type="danger" strong className="text-lg">
              Không tìm thấy dữ liệu vé
            </Text>
            <Button
              type="primary"
              size="large"
              style={{ backgroundColor: '#29A36A', borderColor: '#29A36A' }}
              onClick={() => navigate('/find-ticket')}
            >
              Quay về
            </Button>
          </Space>
        </Card>
      </div>
    );
  }

  // Ticket details
  const ticketDetails = {
    phoneNum: ticket?.customer_phone_number || 'N/A',
    userName: ticket?.customer_name || 'N/A',
    email: ticket?.customer_email || 'N/A',
    dateTime: ticket?.create_at ? formatToVietnamTime(ticket.create_at) : 'N/A',
    checkout: ticket?.method || 'N/A',
    cashier: userName || 'N/A',
  };

  // Bill details
  const billDetail = {
    billId: ticket?.cart_id || 'N/A',
    data:
      ticket?.data?.map((item: TicketDetailResponseData) => ({
        ticketEle: item.service_name || 'N/A',
        ticketType: item.org_name || 'N/A',
        ticketQuantity: String(item.quantity || 0),
        ticketPrice: String(item.service_price || 0),
      })) || [],
    billPrice: ticket?.total_price || 0,
    billDiscount: 0,
    billDiscountPercent: 0,
    billSold: ticket?.total_price || 0,
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 flex justify-around h-[40rem]">
      <div className="w-full max-w-10xl flex flex-col md:flex-row gap-10 ">
        {/* Customer Information */}
        <div className="flex-1">
          <Card
            title={<Title level={4}>Thông tin khách hàng</Title>}
            className="shadow-lg h-full"
            extra={
              <Button
                type="primary"
                style={{ backgroundColor: '#29A36A', borderColor: '#29A36A' }}
                onClick={() => navigate('/find-ticket')}
              >
                Quay về
              </Button>
            }
          >
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Họ và Tên">{ticketDetails.userName}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{ticketDetails.phoneNum}</Descriptions.Item>
              <Descriptions.Item label="Email">{ticketDetails.email}</Descriptions.Item>
              <Descriptions.Item label="Ngày giờ">{ticketDetails.dateTime}</Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán">
                {ticketDetails.checkout}
              </Descriptions.Item>
              {/* <Descriptions.Item label="Nhân viên">{ticketDetails.cashier}</Descriptions.Item> */}
            </Descriptions>
          </Card>
        </div>

        {/* Bill Details */}
        <div className="flex-1">
          <Card
            title={<Title level={4}>Thông tin thanh toán - {billDetail.billId}</Title>}
            className="shadow-lg h-full"
          >
            <Space direction="vertical" size="middle" className="w-full overflow-x-auto h-[20rem]">
              {billDetail.data.length > 0 ? (
                billDetail.data.map((ticket: TicketItem, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-200"
                  >
                    <Text className="w-1/4">{ticket.ticketEle}</Text>
                    <Text className="w-1/4">{ticket.ticketType}</Text>
                    <Text className="w-1/4">x{ticket.ticketQuantity}</Text>
                    <Text className="w-1/4 text-right">
                      {formatCurrency(parseFloat(ticket.ticketPrice))}
                    </Text>
                  </div>
                ))
              ) : (
                <Text className="text-center">Không có dữ liệu vé</Text>
              )}
            </Space>
            <div className="pt-4 border-t border-gray-200 mt-10">
              <div className="flex justify-between">
                <Text strong className='text-[20px]'>Tổng</Text>
                <Text strong className='text-[20px]'>{formatCurrency(billDetail.billPrice)}</Text>
              </div>
              <div className="flex justify-between">
                <Text strong className='text-[20px]'>Phụ thu</Text>
                <Space>
                  <Text className='text-[20px]'>{billDetail.billDiscountPercent}%</Text>
                  <Text className='text-[20px]' >{formatCurrency(billDetail.billDiscount)}</Text>
                </Space>
              </div>
              <div className="flex justify-between">
                <Text strong className='text-[20px] text-[#1F7A50]'>
                  Thành tiền
                </Text>
                <Text strong  className='text-[20px] text-[#1F7A50]'>
                  {formatCurrency(billDetail.billSold)}
                </Text>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetailTicketPage;