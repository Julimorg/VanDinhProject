import { useGetPermission } from '@/Hook/useGetPermission';

import React, { useState, useEffect } from 'react';
import { useGetPermissionById } from '../Hook/usegetpermissionbyid';
import { useUpdatePermissionById } from '../Hook/useUpdatePermissionbyid';

interface EditUsersModalProps {
  visible: boolean;
  userId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const EditUsersModal: React.FC<EditUsersModalProps> = ({ visible, userId, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { data: allPermissions = [] } = useGetPermission();
  const { data: userPermissions = [] } = useGetPermissionById(userId, visible);

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const { mutateAsync: updatePermission } = useUpdatePermissionById();
  useEffect(() => {
    if (visible && userPermissions.length > 0) {
      const selectedIds = userPermissions.map((p) => p.permission_id);
      setSelectedPermissions(selectedIds);
    }
  }, [userPermissions, visible]);

  const handleCheckboxChange = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = {
        permission_id: selectedPermissions,
      };

      const res = await updatePermission({ user_id: userId, body });
      console.log('Update result:', res);

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to update permission:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-[90%] max-w-[800px] p-6 rounded-2xl shadow-xl"
      >
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Chỉnh sửa quyền người dùng
        </h2>

        {loading ? (
          <p className="mb-4 text-center text-gray-500">Đang tải...</p>
        ) : (
          <>
            <div className="mb-6 overflow-hidden border rounded-xl">
              <div className="overflow-y-auto max-h-[22rem]">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 z-10 bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 font-medium text-left text-gray-600">Chọn</th>
                      <th className="px-4 py-3 font-medium text-left text-gray-600">Tên quyền</th>
                      <th className="px-4 py-3 font-medium text-left text-gray-600">Mô tả</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allPermissions.map((perm) => (
                      <tr
                        key={perm.permission_id}
                        className="transition-colors border-t hover:bg-blue-50"
                      >
                        <td className="px-4 py-2">
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(perm.permission_id)}
                            onChange={() => handleCheckboxChange(perm.permission_id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-2 font-medium text-gray-800">
                          {perm.permission_name}
                        </td>
                        <td className="px-4 py-2 text-gray-600">{perm.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-5 py-2 text-white rounded-md transition-all ${
                  loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default EditUsersModal;
