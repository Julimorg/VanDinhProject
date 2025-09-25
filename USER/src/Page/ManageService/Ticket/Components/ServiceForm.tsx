import React from 'react';

interface ServiceFormProps {
  title: string;
  formData: {
    name: string;
    type: string;
    price: string | number;
    description: string;
    image?: File | string;
    is_combo?: boolean;
  };
  onChange: (e: React.ChangeEvent<any>) => void;
  onImageChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  isEnglish?: boolean;
  showComboCheckbox?: boolean;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  title,
  formData,
  onChange,
  onImageChange,
  error,
  isEnglish = false,
  showComboCheckbox = false,
}) => {
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      onChange(e);
    }
  };

  return (
    <div>
      <h3 className="mb-4 text-xl font-semibold">{title}</h3>

      <label className="block mb-1 font-medium">{isEnglish ? 'Service Name' : 'Tên dịch vụ'}</label>
      <input
        name="name"
        value={formData.name}
        onChange={onChange}
        className="w-full p-2 mb-3 border rounded"
      />

      <label className="block mb-1 font-medium">
        {isEnglish ? 'Service Type' : 'Loại dịch vụ'}
      </label>
      <input
        name="type"
        value={formData.type}
        onChange={onChange}
        className="w-full p-2 mb-3 border rounded"
      />

      <label className="block mb-1 font-medium">{isEnglish ? 'Price' : 'Giá'}</label>
      <input
        name="price"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={formData.price}
        onChange={handlePriceChange}
        className="w-full p-2 mb-3 border rounded"
        placeholder="Chỉ nhập số nguyên"
      />

      <label className="block mb-1 font-medium">{isEnglish ? 'Description' : 'Mô tả'}</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={onChange}
        className="w-full p-2 mb-3 border rounded"
      />

      {!isEnglish && onImageChange && (
        <>
          <label className="block mb-1 font-medium">Hình ảnh</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={onImageChange}
            className="w-full p-2 mb-3 border rounded"
          />
          {formData.image && (
            <img
              src={
                formData.image instanceof File
                  ? URL.createObjectURL(formData.image)
                  : formData.image
              }
              alt="Preview"
              className="object-cover w-32 h-32 mt-2 border rounded"
            />
          )}

          {showComboCheckbox && !isEnglish && (
            <>
              <label className="inline-flex items-center mt-3">
                <input
                  type="checkbox"
                  name="is_combo"
                  checked={!!formData.is_combo}
                  onChange={onChange}
                  className="mr-2"
                />
                Là combo
              </label>
            </>
          )}
        </>
      )}

      {error && <p className="mt-2 text-sm text-red-600 whitespace-pre-line">{error}</p>}
    </div>
  );
};

export default ServiceForm;
