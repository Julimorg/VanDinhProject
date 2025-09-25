import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '@/Components/Loading';
import { useDetailSevice } from '../hook/usegetDtailService';
import { useUpdateService } from '../hook/useupdateService';
import ServiceForm from './ServiceForm';

const EditService: React.FC = () => {
  const navigate = useNavigate();
  const { id: service_id } = useParams();

  const { data, isLoading } = useDetailSevice(service_id || '');
  const updateService = useUpdateService();

  const [formVi, setFormVi] = useState({
    name: '',
    type: '',
    price: '',
    description: '',
    image: '' as string | File,
    is_combo: false,
  });

  const [formEn, setFormEn] = useState({
    name: '',
    type: '',
    price: '',
    description: '',
  });

  const [errors, setErrors] = useState<{ vi?: string; en?: string }>({});
  const [isImageValid, setIsImageValid] = useState(true);

  useEffect(() => {
    if (!data) return;

    const translation = data.translateServices?.[0];

    setFormVi({
      name: data.name || '',
      type: data.type || '',
      price: data.price?.toString() || '',
      description: data.description || '',
      image: data.image || '',
      is_combo: data.is_Combo || false,
    });

    setFormEn({
      name: translation?.translate_name || '',
      type: translation?.translate_type || '',
      price: translation?.translate_price?.toString() || '',
      description: translation?.translate_description || '',
    });
  }, [data]);

  const handleViChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const { name, type, value } = target;
    const val = type === 'checkbox' ? (target as HTMLInputElement).checked : value;

    setFormVi((prev) => ({ ...prev, [name]: val }));
  };

  const handleEnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormEn((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    const allowedExts = ['jpg', 'jpeg', 'png', 'webp'];
    const fileTypeValid = allowedTypes.includes(file.type);
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const extValid = allowedExts.includes(ext);

    if (!fileTypeValid || !extValid) {
      toast.error('File không hợp lệ. Chỉ chấp nhận ảnh JPG, PNG, WEBP.');
      setIsImageValid(false);
      return;
    }

    setFormVi((prev) => ({ ...prev, image: file }));
    setIsImageValid(true);
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formVi.name || !formVi.type || !formVi.price || !formVi.description) {
      newErrors.vi = 'Vui lòng nhập đầy đủ thông tin tiếng Việt';
    }
    if (!formEn.name || !formEn.type || !formEn.price || !formEn.description) {
      newErrors.en = 'Vui lòng nhập đầy đủ thông tin tiếng Anh';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (!isImageValid) {
      toast.error('Ảnh không hợp lệ. Không thể lưu.');
      return;
    }

    const formData = new FormData();
    formData.append('name', formVi.name);
    formData.append('type', formVi.type);
    formData.append('price', formVi.price);
    formData.append('description', formVi.description);
    formData.append('is_Combo', String(formVi.is_combo));

    if (formVi.image instanceof File) {
      formData.append('image', formVi.image);
    }

    formData.append('language_id', '0196cce9-cadf-7881-894d-b4a5ac0889ff');
    formData.append('translate_name', formEn.name);
    formData.append('translate_type', formEn.type);
    formData.append('translate_description', formEn.description);

    updateService.mutate(
      { service_id: service_id || '', data: formData },
      {
        onSuccess: () => {
          toast.success('Cập nhật thành công');
          navigate(-1);
        },
        onError: () => toast.error('Cập nhật thất bại'),
      }
    );
  };

  if (isLoading) return <Loading />;

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl p-6 mx-auto bg-white rounded shadow">
      <h2 className="mb-6 text-2xl font-semibold text-center">Chỉnh sửa dịch vụ</h2>

      <div className="grid grid-cols-2 gap-8">
        <ServiceForm
          title="Tiếng Việt"
          formData={formVi}
          onChange={handleViChange}
          onImageChange={handleImageUpload}
          error={errors.vi}
          showComboCheckbox={false}
        />
        <ServiceForm
          title="Tiếng Anh"
          formData={formEn}
          onChange={handleEnChange}
          error={errors.en}
          isEnglish
        />
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={!isImageValid}
          className="px-4 py-2 text-white bg-blue-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Lưu
        </button>
      </div>
    </form>
  );
};

export default EditService;
