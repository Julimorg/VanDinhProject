import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateUser } from '../Hook/useCreateUser';

import type { DevRegisterRequest } from '@/Interface/TDevRegister';
import { toast } from 'react-toastify';
import Loading from '@/Components/Loading';
import type { AxiosError } from 'axios';
import { useGetPermission } from '@/Hook/useGetPermission';

const AddUsers = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Partial<DevRegisterRequest>>({});
  const initialFormState: DevRegisterRequest = {
    username: '',
    email: '',
    fullname: '',
    password: '',
    role: '',
    permission_id: [],
  };
  const [form, setForm] = useState<DevRegisterRequest>(initialFormState);

  const { data: permissions = [], isLoading: isLoadingPermissions } = useGetPermission();

  const { mutate, isPending } = useCreateUser({
    onSuccess: () => {
      toast.success('Tạo người dùng thành công!');
      navigate('/users');
      setForm(initialFormState);
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      const errorMessage = err.response?.data || 'Đã có lỗi xảy ra khi tạo người dùng!';
      toast.error(`${errorMessage}`);
      setForm(initialFormState);
      console.log(err);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePermissionToggle = (id: string) => {
    setForm((prev) => {
      const exists = prev.permission_id?.includes(id);
      const newPermissions = exists
        ? prev.permission_id?.filter((pid: string) => pid !== id)
        : [...(prev.permission_id || []), id];
      return { ...prev, permission_id: newPermissions };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<DevRegisterRequest> = {};

    if (!form.username) newErrors.username = 'Vui lòng nhập tên người dùng';
    if (!form.email) newErrors.email = 'Vui lòng nhập email';
    if (!form.fullname) newErrors.fullname = 'Vui lòng nhập họ và tên';
    if (!form.password) newErrors.password = 'Vui lòng nhập mật khẩu';
    if (!form.role) newErrors.role = 'Vui lòng chọn vai trò';

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log('Payload:', form);
      mutate({
        ...form,
        permission_id: [...(form.permission_id ?? [])],
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-[700px] bg-white p-6 rounded-lg shadow-lg mx-auto">
      {isPending && <Loading />}
      <h2 className="mb-6 text-xl font-semibold text-center">Thêm người dùng mới</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1 text-sm font-medium">
            Tên người dùng <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Nhập tên người dùng"
            className={`w-full px-3 py-2 border rounded-md ${
              errors.username ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Nhập email"
            className={`w-full px-3 py-2 border rounded-md ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1 text-sm font-medium">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullname"
            value={form.fullname}
            onChange={handleChange}
            placeholder="Nhập họ và tên"
            className={`w-full px-3 py-2 border rounded-md ${
              errors.fullname ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.fullname && <p className="mt-1 text-xs text-red-500">{errors.fullname}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">
            Mật khẩu <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Nhập mật khẩu"
            className={`w-full px-3 py-2 border rounded-md ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-1 text-sm font-medium">
            Vai trò <span className="text-red-500">*</span>
          </label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.role ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Chọn loại vai trò</option>
            <option value="RECEIPTER">RECEIPTER</option>
          </select>
          {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role}</p>}
        </div>
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium">Phân quyền</label>
        {isLoadingPermissions ? (
          <p>Đang tải danh sách quyền...</p>
        ) : (
          <div className="p-3 overflow-y-auto border rounded-md max-h-48">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left">Chọn</th>
                  <th className="text-left">Tên quyền</th>
                  <th className="text-left">Mô tả</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((perm) => (
                  <tr key={perm.permission_id} className="border-t">
                    <td>
                      <input
                        type="checkbox"
                        checked={form.permission_id?.includes(perm.permission_id)}
                        onChange={() => handlePermissionToggle(perm.permission_id)}
                      />
                    </td>
                    <td>{perm.permission_name}</td>
                    <td>{perm.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => navigate('/users')}
          className="px-5 py-2 text-gray-800 bg-gray-100 border rounded-md hover:bg-gray-200"
        >
          Hủy bỏ
        </button>
        <button
          type="submit"
          className="px-6 py-2 text-white bg-blue-700 rounded-md hover:bg-blue-800"
        >
          Lưu lại
        </button>
      </div>
    </form>
  );
};

export default AddUsers;
