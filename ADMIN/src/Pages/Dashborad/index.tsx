import { Container, Header, Subtitle, CardContainer, SectionTitle, GuideBox } from './styles';
import NavBar from '@/Components/Header/index';

import Card from './Components/Card/Card';
import TabSwitcher from './Components/Tab/TabSwitcher';
import { useState } from 'react';
import { Icons } from '@/Components/Icons';
import TicketTypeBox from './Components/TicketTypeBox/TicketTypeBox';
import InstructionBox from './Components/InstructionBox/Instructionbox';
import Card2 from './Components/Card/Card2';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';

import ModalBox from '@/Components/ModalBox/ModalBox';
import { useShiftStore } from '@/Hook/LocalUseContext/CrashierShift/ShiftProvider';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('QuanLyVe');
  const { checkOnShift } = useShiftStore();

  const [showOnShiftModal, setShowOnShiftModal] = useState(false);

  const handleTicketNavigation = () => {
    if (checkOnShift) {
      setShowOnShiftModal(true);
    }
  };

  const navigate = useNavigate();
  const banVeMoiSteps = [
    'Đi đến trang Bán vé từ menu chính',
    'Chọn loại vé: Vào cửa, Dịch vụ, Combo, Thẻ thành viên',
    'Chọn đối tượng (Người lớn, Trẻ em, Gia đình)',
    'Nhập số lượng và thông tin khách hàng',
    'Áp dụng mã giảm giá nếu có',
    'Chọn phương thức thanh toán',
    'Hoàn tất giao dịch và in vé hoặc gửi vé qua email',
  ];

  const huyVeSteps = [
    'Đi đến trang Đổi/Hủy vé từ menu chính',
    'Quét mã QR hoặc nhập mã vé cần đổi/hủy',
    'Xem thông tin chi tiết của vé',
    'Chọn hành động (Đổi vé hoặc Hủy vé)',
    'Nếu đổi vé, chọn loại vé mới và thực hiện các bước tương tự bán vé',
    'Nếu hủy vé, xác nhận và chọn phương thức hoàn tiền',
    'Hoàn tất quy trình và cập nhật trạng thái vé',
  ];

  return (
    <>
      <NavBar />
      <Container>
        <Header>Chào mừng đến với ZENTRY</Header>
        <Subtitle>
          Hệ thống quản lý vé thông minh giúp bạn tối ưu hóa quy trình bán vé và nâng cao trải
          nghiệm khách hàng
        </Subtitle>

        <CardContainer>
          <Card
            icon={<Icons.SaleTicket style={{ color: '#29a36a' }} />}
            title="Bán vé"
            description="Bán cho khách hàng một cách nhanh chóng"
            buttonText="Đi đến bán vé"
            onClick={() => navigate('/ticket')}
          />
          <Card
            icon={<Icons.Calendar style={{ color: '#29a36a' }} />}
            title="Ca làm việc"
            description="Quản lý và theo dõi hiệu suất làm việc theo từng ca"
            buttonText="Đi đến ca làm việc"
            onClick={() => navigate('/shift')}
          />
          <Card
            icon={<Icons.Search style={{ color: '#29a36a' }} />}
            title="Tìm kiếm"
            description="Tìm kiếm cho khách hàng có nhu cầu"
            buttonText="Đi đến tìm kiếm"
            onClick={() => navigate('/find-ticket')}
          />
        </CardContainer>
        {showOnShiftModal && (
          <ModalBox
            title="Vui lòng bắt đầu ca làm"
            width="max-w-2xl"
            height="h-[10rem]"
            className="border border-gray-200 bg-gray-50"
            onOk={() => {
              setShowOnShiftModal(false);
              navigate('/shift');
            }}
            onCancel={() => {
              setShowOnShiftModal(false);
            }}
          >
            <div>
              <h3>Vui lòng chuyển sang trang "Ca Làm Việc" để bắt đầu ca làm</h3>
            </div>
          </ModalBox>
        )}
        <SectionTitle>Hướng dẫn sử dụng</SectionTitle>
        <TabSwitcher activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'QuanLyVe' ? (
          <Box
            sx={{
              backgroundColor: '#f9f9f9',
              padding: 4,
              borderRadius: 2,
              // boxShadow: 2,
              mt: 4,
            }}
          >
            <div className="flex justify-between gap-4 mb-6">
              <div className="w-1/2">
                <InstructionBox title="Bán vé mới" steps={banVeMoiSteps} />
              </div>
              <div className="w-1/2">
                <InstructionBox title="Hủy vé" steps={huyVeSteps} />
              </div>
            </div>

            <h2 className="mb-4 text-lg font-semibold">Các loại vé được hỗ trợ</h2>
            <div className="grid grid-cols-2 gap-4">
              <TicketTypeBox
                title="Vé vào cửa"
                description="Vé cơ bản cho phép khách hàng vào khu vực..."
              />
              <TicketTypeBox
                title="Vé dịch vụ"
                description="Dành cho các dịch vụ đơn lẻ như công viên nước..."
              />
              <TicketTypeBox
                title="Vé combo"
                description="Kết hợp nhiều dịch vụ với giá ưu đãi..."
              />
              <TicketTypeBox
                title="Thẻ thành viên"
                description="Thẻ hàng tháng hoặc hàng năm cho khách hàng thường xuyên..."
              />
            </div>
          </Box>
        ) : (
          <GuideBox>
            <h3 className="mb-4 text-lg font-semibold">Ca làm việc</h3>
            <p className="mb-4 text-lg">
              Hệ thống quản lý ca làm việc giúp theo dõi thời gian làm việc của nhân viên, hiệu suất
              bán hàng và tạo báo cáo chi tiết cho từng ca
            </p>

            <div className="flex justify-between gap-1">
              <div className="w-full sm:w-1/2 lg:w-1/3">
                <Card2
                  icon={<Icons.NumberOne style={{ color: '#29a36a' }} />}
                  title="Xem tổng kết"
                  description="Kiểm tra tổng số vé đã bán, doanh thu, phương thức thanh toán và các thống kê quan trọng khác. Đảm bảo số liệu chính xác."
                />
              </div>
              <div className="w-full sm:w-1/2 lg:w-1/3">
                <Card2
                  icon={<Icons.NumberTwo style={{ color: '#29a36a' }} />}
                  title="Đối soát tiền"
                  description="Kiểm đếm tiền mặt thu được và đối chiếu với số liệu trên hệ thống. Ghi nhận các khoản chênh lệch (nếu có) vào báo cáo."
                />
              </div>
              <div className="w-full sm:w-1/2 lg:w-1/3">
                <Card2
                  icon={<Icons.NumberThree style={{ color: '#29a36a' }} />}
                  title="Xác nhận kết thúc ca"
                  description="Nhấn 'Xác nhận & Kết thúc ca' để hoàn tất quy trình. Các báo cáo sẽ được lưu trữ và có thể xem lại trong phần lịch sử ca làm việc."
                />
              </div>
            </div>
          </GuideBox>
        )}
      </Container>
    </>
  );
};

export default Dashboard;
