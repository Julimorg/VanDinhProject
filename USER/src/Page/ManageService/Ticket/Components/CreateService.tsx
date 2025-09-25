import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Loading from '@/Components/Loading';
import { useLanguage } from '@/Auth/Login/Hook/usegetLanguage';
import type { Language } from '@/Interface/TLanguage';

import { useCreateService } from '../hook/usecreateService';
import ServiceForm from './ServiceForm';

const CreateService: React.FC = () => {
  const navigate = useNavigate();
  const createServiceMutation = useCreateService();
  const { data: languageData, isLoading: isLangLoading } = useLanguage();

  const [selectedLangId, setSelectedLangId] = useState('');
  const [formVi, setFormVi] = useState({
    name: '',
    type: '',
    price: '',
    description: '',
    image: '' as string | File,
    is_combo: false,
    customer_type: 'ADULT',
  });

  const [formEn, setFormEn] = useState({
    name: '',
    type: '',
    price: '',
    description: '',
    is_combo: false,
  });

  const [errors, setErrors] = useState<{ vi?: string; en?: string; language?: string }>({});

  const selectedLangCode = useMemo(() => {
    const selectedLang = languageData?.data.find((lang) => lang.id === selectedLangId);
    return selectedLang?.code?.toLowerCase() || '';
  }, [languageData, selectedLangId]);

  const isVietnamese = selectedLangCode.startsWith('vi');

  const handleChangeVi = (e: React.ChangeEvent<any>) => {
    const { name, type, value, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormVi((prev) => ({ ...prev, [name]: val }));
  };

  const handleChangeEn = (e: React.ChangeEvent<any>) => {
    const { name, type, value, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormEn((prev) => ({ ...prev, [name]: val }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    const allowedExts = ['jpg', 'jpeg', 'png', 'webp'];
    const fileTypeValid = allowedTypes.includes(file.type);
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const extValid = allowedExts.includes(ext);

    if (!fileTypeValid || !extValid) {
      toast.error('File không hợp lệ. Chỉ chấp nhận ảnh JPG, PNG, WEBP.');
      return;
    }

    setFormVi((prev) => ({ ...prev, image: file }));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLangId(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    if (!formVi.name || !formVi.type || !formVi.price || !formVi.description) {
      newErrors.vi = 'Vui lòng nhập đầy đủ thông tin tiếng Việt';
    }

    if (!isVietnamese) {
      if (!formEn.name || !formEn.type || !formEn.price || !formEn.description) {
        newErrors.en = 'Vui lòng nhập đầy đủ thông tin tiếng Anh';
      }
    }

    if (!selectedLangId) {
      newErrors.language = 'Vui lòng chọn ngôn ngữ';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const formData = new FormData();
    formData.append('name', formVi.name);
    formData.append('type', formVi.type);
    formData.append('price', String(formVi.price));
    formData.append('description', formVi.description);
    formData.append('is_combo', String(formVi.is_combo));
    formData.append('customer_type', formVi.customer_type);

    if (formVi.image instanceof File) {
      formData.append('image', formVi.image);
    }

    formData.append('language_id', selectedLangId);

    if (!isVietnamese) {
      formData.append('translate_name', formEn.name);
      formData.append('translate_type', formEn.type);
      formData.append('translate_description', formEn.description);
      formData.append('translate_price', String(formEn.price));
    }

    createServiceMutation.mutate(formData, {
      onSuccess: () => {
        toast.success('Tạo dịch vụ thành công!');
        navigate(-1);
      },
      onError: () => {
        toast.error('Tạo dịch vụ thất bại!');
      },
    });
  };

  if (isLangLoading) return <Loading />;

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl p-6 mx-auto bg-white rounded shadow">
      <h2 className="mb-6 text-2xl font-semibold text-center">Tạo dịch vụ mới</h2>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Chọn ngôn ngữ</label>
        <select
          className="w-full p-2 border rounded"
          value={selectedLangId}
          onChange={handleLanguageChange}
        >
          <option value="">-- Chọn ngôn ngữ --</option>
          {languageData?.data.map((lang: Language) => (
            <option key={lang.id} value={lang.id}>
              {lang.language_name} ({lang.code})
            </option>
          ))}
        </select>
        {errors.language && <p className="mt-1 text-sm text-red-600">{errors.language}</p>}
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Đối tượng khách hàng</label>
        <select
          name="customer_type"
          className="w-full p-2 border rounded"
          value={formVi.customer_type}
          onChange={handleChangeVi}
        >
          <option value="ADULT">Người lớn</option>
          <option value="CHILDREN">Trẻ em</option>
        </select>
      </div>

      <div className={`grid gap-8 ${isVietnamese ? 'grid-cols-1' : 'grid-cols-2'}`}>
        <ServiceForm
          title="Tiếng Việt"
          formData={formVi}
          onChange={handleChangeVi}
          onImageChange={handleImageChange}
          error={errors.vi}
          isEnglish={false}
          showComboCheckbox={true}
        />
        {!isVietnamese && (
          <ServiceForm
            title="Tiếng Anh"
            formData={formEn}
            onChange={handleChangeEn}
            error={errors.en}
            isEnglish={true}
          />
        )}
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded"
        >
          Hủy
        </button>
        <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded">
          Tạo
        </button>
      </div>
    </form>
  );
};

export default CreateService;
