import { useState, useEffect } from 'react';

interface Props {
  onChange: (user: { name: string; phone: string; email: string }) => void;
}

const isValidPhoneVN = (phone: string): boolean => {
  return /^(0|\+84)[3-9][0-9]{8}$/.test(phone);
};

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const UserForm: React.FC<Props> = ({ onChange }) => {
  const [user, setUser] = useState({ name: '', phone: '', email: '' });
  const [errors, setErrors] = useState({ phone: '', email: '' });

  useEffect(() => {
    onChange(user);
  }, [user]);

  const handleChange = (field: 'name' | 'phone' | 'email', value: string) => {
    setUser((prev) => ({ ...prev, [field]: value }));

    if (field === 'phone') {
      setErrors((prev) => ({
        ...prev,
        phone: isValidPhoneVN(value) ? '' : 'Số điện thoại không hợp lệ',
      }));
    }

    if (field === 'email') {
      setErrors((prev) => ({
        ...prev,
        email: isValidEmail(value) ? '' : 'Email không hợp lệ',
      }));
    }
  };

  return (
    <div className="flex-1 pr-4 space-y-3">
      <input
        className="w-full p-2 text-sm border rounded"
        placeholder="Tên"
        onChange={(e) => handleChange('name', e.target.value)}
      />

      <div>
        <input
          className="w-full p-2 text-sm border rounded"
          placeholder="Số điện thoại"
          onChange={(e) => handleChange('phone', e.target.value)}
        />
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
      </div>

      <div>
        <input
          className="w-full p-2 text-sm border rounded"
          placeholder="Địa chỉ Email"
          onChange={(e) => handleChange('email', e.target.value)}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>
    </div>
  );
};

export default UserForm;





