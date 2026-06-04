import React, { useState } from 'react';
import { Input, Button, Tooltip, Tag, Modal } from 'antd';
import {
  SearchOutlined, PlusOutlined, CalendarOutlined, ClockCircleOutlined,
  DeleteOutlined, EditOutlined, ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { DiaryDayGroup } from '../diaryDetail';
import { useDeleteDiaryItem } from '../Hooks/useDeleteDiaryItem';
import UpdateDiaryItemModal from './UpdateDiaryItemModal';

interface DiaryItemsTableProps {
  days: DiaryDayGroup[];
  onAddItem?: () => void;
}

const fmtVND = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const fmtDateLabel = (iso: string) => {
  if (!iso) return '—';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
};

const fmtDateTime = (iso: string) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const DiaryItemsTable: React.FC<DiaryItemsTableProps> = ({ days, onAddItem }) => {
  const { diaryId } = useParams<{ diaryId: string }>();

  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [editTarget, setEditTarget] = useState<{ itemId: string; item: any } | null>(null);

  const { mutate: deleteItem, isPending: isDeleting } = useDeleteDiaryItem();

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteItem(
      { diaryId: diaryId!, itemId: deleteTarget.id }, 
      { onSuccess: () => setDeleteTarget(null) }
    );
  };

  const filteredDays: DiaryDayGroup[] = search.trim()
    ? days
        .map((d) => ({
          ...d,
          items: d.items.filter((it) => {
            const q = search.toLowerCase();
            return (
              it.productName.toLowerCase().includes(q) ||
              it.color?.toLowerCase().includes(q) ||
              it.volume?.toLowerCase().includes(q)
            );
          }),
        }))
        .filter((d) => d.items.length > 0)
    : days;

  const filteredItems = filteredDays.flatMap((d) => d.items);
  const totalQty = filteredItems.reduce((s, i) => s + i.quantity, 0);
  const totalAmt = filteredItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  let globalIdx = 0;

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 flex-wrap">
          <div>
            <h2 className="text-base font-bold text-gray-800">Danh sách sản phẩm</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {filteredItems.length} sản phẩm · {totalQty} đơn vị
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              allowClear
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="Tìm sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 200, borderRadius: 8 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onAddItem}
              style={{ background: '#C17B3F', borderColor: '#C17B3F', fontWeight: 600, borderRadius: 8 }}
            >
              Thêm sản phẩm
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {filteredDays.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
              Không tìm thấy sản phẩm
            </div>
          ) : (
            <div className="flex flex-col" style={{ gap: 24, padding: '20px 0' }}>
              {filteredDays.map(({ date, items, totalDay }) => {
                const dayQty = items.reduce((s, r) => s + r.quantity, 0);
                return (
                  <div
                    key={date}
                    className="mx-5 rounded-xl overflow-hidden border border-gray-100"
                    style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
                  >
                    {/* Day header */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border-b border-blue-100 flex-wrap">
                      <CalendarOutlined className="text-blue-500" />
                      <span className="text-sm font-bold text-blue-600">{fmtDateLabel(date)}</span>
                      <span className="text-xs text-gray-400">
                        {items.length} sản phẩm · {dayQty} đơn vị
                      </span>
                      <span className="ml-auto text-xs text-gray-500">
                        Cộng ngày:
                        <span className="text-sm font-bold text-blue-600 ml-1">{fmtVND(totalDay)}</span>
                      </span>
                    </div>

                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/80">
                          <th className="w-10 px-4 py-2.5 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">#</th>
                          <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Sản phẩm</th>
                          <th className="w-28 px-4 py-2.5 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Màu sắc</th>
                          <th className="w-24 px-4 py-2.5 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Quy cách</th>
                          <th className="w-32 px-4 py-2.5 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Đơn giá</th>
                          <th className="w-12 px-4 py-2.5 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">SL</th>
                          <th className="w-36 px-4 py-2.5 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Thành tiền</th>
                          <th className="w-44 px-4 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Thời gian</th>
                          <th className="w-40 px-4 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Ghi chú</th>
                          <th className="w-20 px-4 py-2.5 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((row) => {
                          globalIdx += 1;
                          const currentIdx = globalIdx;
                          const subtotal = row.unitPrice * row.quantity;
                          return (
                            <tr
                              key={row.id}
                              className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors group"
                            >
                              <td className="px-4 py-3.5 text-center">
                                <span className="text-xs text-gray-400 font-mono">
                                  {String(currentIdx).padStart(2, '0')}
                                </span>
                              </td>
                              <td className="px-4 py-3.5">
                                <p className="font-semibold text-gray-800 leading-tight">{row.productName}</p>
                              </td>
                              <td className="px-4 py-3.5 text-center">
                                {row.color
                                  ? <span className="text-sm text-gray-600">{row.color}</span>
                                  : <span className="text-gray-300">—</span>}
                              </td>
                              <td className="px-4 py-3.5 text-center">
                                {row.volume ? (
                                  <Tag style={{ fontSize: 11, borderRadius: 4, margin: 0, background: '#F1F5F9', color: '#475569', borderColor: '#E2E8F0' }}>
                                    {row.volume}
                                  </Tag>
                                ) : <span className="text-gray-300">—</span>}
                              </td>
                              <td className="px-4 py-3.5 text-right">
                                <span className="text-sm text-gray-700">{fmtVND(row.unitPrice)}</span>
                              </td>
                              <td className="px-4 py-3.5 text-center">
                                <span className="text-sm font-bold text-orange-600">{row.quantity}</span>
                              </td>
                              <td className="px-4 py-3.5 text-right">
                                <span className="text-sm font-bold text-blue-600">{fmtVND(subtotal)}</span>
                              </td>
                              <td className="px-4 py-3.5">
                                <div className="flex flex-col gap-0.5">
                                  <span className="flex items-center gap-1 text-xs text-gray-400">
                                    <ClockCircleOutlined style={{ fontSize: 10 }} />
                                    {fmtDateTime(row.itemDate || row.createdAt)}
                                  </span>
                                  {row.updatedAt && row.updatedAt !== row.createdAt && (
                                    <span className="text-[10px] text-gray-300">
                                      Sửa: {fmtDateTime(row.updatedAt)}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3.5">
                                {row.itemNote ? (
                                  <Tooltip title={row.itemNote}>
                                    <span className="text-xs text-gray-500 truncate block max-w-[130px] cursor-default leading-relaxed">
                                      {row.itemNote}
                                    </span>
                                  </Tooltip>
                                ) : <span className="text-gray-300">—</span>}
                              </td>

                              {/* Thao tác */}
                              <td className="px-4 py-3.5">
                                <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => setEditTarget({ itemId: row.id, item: row })}
                                    className="w-7 h-7 rounded-md flex items-center justify-center text-gray-300 hover:text-orange-500 hover:bg-orange-50 border-none bg-transparent cursor-pointer"
                                  >
                                    <EditOutlined style={{ fontSize: 13 }} />
                                  </button>
                                  <button
                                    onClick={() => setDeleteTarget({ id: row.id, name: row.productName })}
                                    className="w-7 h-7 rounded-md flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 border-none bg-transparent cursor-pointer"
                                  >
                                    <DeleteOutlined style={{ fontSize: 13 }} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })}

              {/* Grand total */}
              <div className="mx-5 flex items-center justify-between px-5 py-3.5 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-sm font-bold text-gray-700">Tổng cộng</span>
                <div className="flex items-center gap-6">
                  <span className="text-xs text-gray-400">
                    Số lượng: <span className="text-sm font-bold text-gray-800 ml-1">{totalQty}</span>
                  </span>
                  <span className="text-xs text-gray-400">
                    Thành tiền:{' '}
                    <span className="text-sm font-bold text-emerald-700 ml-1">{fmtVND(totalAmt)}</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete modal */}
      <Modal
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        centered
        width={420}
        styles={{
          content: { padding: 0, borderRadius: 16, overflow: 'hidden' },
          header: { display: 'none' },
          footer: { padding: '12px 20px', borderTop: '1px solid #F1F5F9', marginTop: 0 },
        }}
        footer={
          <div className="flex justify-end gap-2">
            <Button onClick={() => setDeleteTarget(null)} disabled={isDeleting}>Huỷ</Button>
            <Button
              danger
              type="primary"
              icon={<DeleteOutlined />}
              loading={isDeleting}
              onClick={handleConfirmDelete}
            >
              Xoá
            </Button>
          </div>
        }
      >
        <div className="px-6 pt-6 pb-4 flex gap-4 items-start">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <ExclamationCircleOutlined className="text-red-500 text-lg" />
          </div>
          <div>
            <p className="text-[15px] font-bold text-slate-900 mb-1">Xoá sản phẩm?</p>
            <p className="text-sm text-slate-500 leading-relaxed">
              Bạn chắc chắn muốn xoá{' '}
              <span className="font-semibold text-slate-700">"{deleteTarget?.name}"</span>{' '}
              khỏi nhật ký? Hành động này không thể hoàn tác.
            </p>
          </div>
        </div>
      </Modal>

      {/* Edit modal */}
      <UpdateDiaryItemModal
        open={!!editTarget}
        itemId={editTarget?.itemId ?? null}
        initialValues={editTarget?.item ?? null}
        onClose={() => setEditTarget(null)}
      />
    </>
  );
};

export default DiaryItemsTable;