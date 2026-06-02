import React from "react";
import { ConfigProvider, message, Skeleton, Result, Button } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import DiaryItemsTable from "./Components/DiaryDetailTable";
import DiaryDetailHeader from "./Components/UserDiaryDetailHeader";
import { GetDiaryDetailRes, DiaryStatus } from "./diaryDetail";
import DiaryInfoCards from "./Components/DiaryInfoCard";

// ── Static mock data — shape of GetDiaryDetailRes ─────────────────────────
// Khi tích hợp API: xoá MOCK_DETAIL, dùng useGetDiaryDetail(id)
const MOCK_DETAIL: GetDiaryDetailRes = {
  id: "D002",
  diaryName: "Đơn sơn epoxy xưởng chị Lan",
  diaryStatus: DiaryStatus.PARTIAL,
  diaryDate: "2025-05-15",
  totalAmount: 18600000,
  totalQuantity: 8,
  note: "Chưa thanh toán đủ. Chị Lan đã cọc 8tr, còn lại 10.6tr giao lần 2. Liên hệ SĐT 0912345678.",
  createdBy: "nguyen.van.a",
  createdAt: "2025-05-14T10:30:00",
  updatedAt: "2025-05-15T08:00:00",
  items: [
    { id:"I001", productId:"PROD-002", productName:"Sơn epoxy sàn nhà",          quantity:3, volume:"4L",   color:"Xanh dương", unitPrice:890000,  itemNote:"Màu theo mẫu chị Lan gửi",  createAt:"2025-05-14T10:30:00", updateAt:"2025-05-14T10:30:00" },
    { id:"I002", productId:"PROD-005", productName:"Sơn epoxy chịu hoá chất",     quantity:2, volume:"18L",  color:"Xám xi măng",unitPrice:3200000, itemNote:"",                           createAt:"2025-05-14T10:30:00", updateAt:"2025-05-14T10:30:00" },
    { id:"I003", productId:"PROD-001", productName:"Lớp lót epoxy 2 thành phần",  quantity:2, volume:"5L",   color:"Trắng",      unitPrice:1150000, itemNote:"Phải trộn đúng tỉ lệ 2:1",  createAt:"2025-05-14T10:30:00", updateAt:"2025-05-14T10:30:00" },
    { id:"I004", productId:"PROD-009", productName:"Dung môi pha sơn epoxy",      quantity:1, volume:"1L",   color:"",           unitPrice:320000,  itemNote:"",                           createAt:"2025-05-14T10:30:00", updateAt:"2025-05-14T10:30:00" },
  ],
};

const UserDiaryDetailPage: React.FC = () => {
  const { diaryId } = useParams<{ diaryId: string }>();
  const navigate = useNavigate();

  // Khi tích hợp API:
  // const { data, isLoading, isError } = useGetDiaryDetail(diaryId);
  // const detail = data?.data;
  const isLoading = false;
  const isError   = false;
  const detail    = MOCK_DETAIL;

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <ConfigProvider theme={{ token: { colorPrimary: "#C17B3F", borderRadius: 8 } }}>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5">
            <Skeleton active paragraph={{ rows: 1 }} />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[1,2,3,4].map(i => (
                <Skeleton.Button key={i} active block style={{ height: 80, borderRadius: 12 }} />
              ))}
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <Skeleton active paragraph={{ rows: 3 }} />
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <Skeleton active paragraph={{ rows: 6 }} />
            </div>
          </div>
        </div>
      </ConfigProvider>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (isError || !detail) {
    return (
      <ConfigProvider theme={{ token: { colorPrimary: "#C17B3F", borderRadius: 8 } }}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Result
            status="404"
            title="Không tìm thấy nhật ký"
            subTitle={`Nhật ký "${diaryId}" không tồn tại hoặc đã bị xoá.`}
            extra={
              <Button
                type="primary"
                style={{ background: "#C17B3F", borderColor: "#C17B3F" }}
                onClick={() => navigate(-1)}
              >
                Quay lại
              </Button>
            }
          />
        </div>
      </ConfigProvider>
    );
  }

  // ── Main ──────────────────────────────────────────────────────────────────
  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#C17B3F", borderRadius: 8 } }}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5">

          {/* Header */}
          <DiaryDetailHeader
            data={detail}
            onBack={() => navigate(-1)}
            onEdit={() => message.info("Chỉnh sửa nhật ký")}
            onMarkPaid={() => message.success("Đã đánh dấu thanh toán")}
            onCancel={() => message.warning("Đã huỷ nhật ký")}
            onPrint={() => window.print()}
          />

          {/* Stat cards + info */}
          <DiaryInfoCards data={detail} />

          {/* Items table */}
          <DiaryItemsTable
            items={detail.items ?? []}
            onAddItem={() => message.info("Thêm sản phẩm")}
          />

        </div>
      </div>
    </ConfigProvider>
  );
};

export default UserDiaryDetailPage;