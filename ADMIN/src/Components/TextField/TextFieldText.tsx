import { Input } from 'antd';

interface TextFieldProps {
  title: string;
  type?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  width?: string | number;
  height?: string | number;
  backgroundColor?: string;
  fontSize?: string | number;
  border?: string | number;
  placeholderColor?: string;

}

const TextFieldText: React.FC<TextFieldProps> = ({
  title,
  type = 'text',
  value,
  onChange,
  onFocus,
  onBlur,
  width,
  height,
  backgroundColor,
  fontSize,
  border,
  placeholderColor
}) => {
  const inputStyle: React.CSSProperties = {
    width: width || '100%',
    height: height || 32,
    backgroundColor: backgroundColor || 'transparent',
    fontSize: fontSize || 14,
    border: border || '1px solid #d9d9d9',
  };
  return (
    <>
      <style>
        {`
          .custom-placeholder::placeholder {
            color: ${placeholderColor || '#d9d9d9'};
            opacity: 1;
          }
        `}
      </style>
      <Input
        type={type}
        placeholder={title}
        value={value}
        onChange={onChange}
        style={inputStyle}
        onFocus={onFocus}
        onBlur={onBlur}
        className="custom-placeholder"
      />
    </>
  );
};

export default TextFieldText;
