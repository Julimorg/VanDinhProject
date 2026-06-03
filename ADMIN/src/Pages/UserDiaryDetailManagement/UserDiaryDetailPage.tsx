import React, { useEffect } from "react";
import { Skeleton, Result, Button } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetDiaryDetail } from "./Hooks/useGetDiaryDetail";
import DiaryItemsTable from "./Components/DiaryDetailTable";
import DiaryDetailHeader from "./Components/UserDiaryDetailHeader";
import DiaryInfoCards from "./Components/DiaryInfoCard";
import { GetDiaryDetailRes, DiaryStatus } from "./diaryDetail";
import { IGetDiaryDetailRes } from "@/Interface/Diary/GetDiaryDetail";

// map API → local type
const mapDetail = (d: IGetDiaryDetailRes): GetDiaryDetailRes => ({
  id:            d.id,
  diaryName:     d.diaryName,
  diaryStatus:   d.diaryStatus as DiaryStatus,
  totalAmount:   d.totalAmount,
  totalQuantity: d.totalQuantity,
  note:          d.note,
  days:          d.days,
  createdBy:     d.createdBy,
  createdAt:     d.createdAt,
  updatedAt:     d.updatedAt,
});

const UserDiaryDetailPage: React.FC = () => {
  const { diaryId, userId } = useParams<{ diaryId: string; userId: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useGetDiaryDetail(diaryId);

  useEffect(() => {
    if (isError) {
      const msg = (error as any)?.response?.data?.message ?? "Tải nhật ký thất bại.";
      toast.error(`❌ ${msg}`, { position: "top-right", autoClose: 4000 });
      navigate(`/diary/${userId}`);
    }
  }, [isError]);

  const detail = data?.data ? mapDetail(data.data) : null;

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
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
    );
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  if (!detail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Result
          status="404"
          title="Không tìm thấy nhật ký"
          subTitle={`Nhật ký "${diaryId}" không tồn tại hoặc đã bị xoá.`}
          extra={
            <Button
              type="primary"
              style={{ background: "#C17B3F", borderColor: "#C17B3F" }}
              onClick={() => navigate(`/diary/${userId}`)}
            >
              Quay lại
            </Button>
          }
        />
      </div>
    );
  }

  // ── Main ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5">

        <DiaryDetailHeader
          data={detail}
          onBack={() => navigate(`/diary/${userId}`)}
          onEdit={() => toast.info("Chỉnh sửa nhật ký")}
          onMarkPaid={() => toast.success("Đã đánh dấu thanh toán")}
          onCancel={() => toast.warning("Đã huỷ nhật ký")}
          onPrint={() => window.print()}
        />

        <DiaryInfoCards data={detail} />

        <DiaryItemsTable
          days={detail.days}
          onAddItem={() => toast.info("Thêm sản phẩm")}
        />

      </div>
    </div>
  );
};

export default UserDiaryDetailPage;