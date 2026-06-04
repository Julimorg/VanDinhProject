import { Form, Modal, Input, Button } from "antd";
import { useCreateDiary } from "../Hooks/useCreateDiary";

export const CreateDiaryModal: React.FC<{
  open: boolean;
  onClose: () => void;
  userId: string;
}> = ({ open, onClose, userId }) => {
  const [form] = Form.useForm();
  const { mutate, isPending } = useCreateDiary(userId);

  const handleSubmit = (values: { diaryName: string; note?: string }) => {
    mutate({ ...values, note: values.note || "" }, { onSuccess: onClose });
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Tạo nhật ký mới">
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="diaryName"
          label="Tên nhật ký"
          rules={[{ required: true, message: "Tên nhật ký không được để trống" }]}
        >
          <Input
            placeholder="VD: Phiếu tháng 1/2025 - Nguyễn Văn A"
            maxLength={100}
            showCount
          />
        </Form.Item>
        <Form.Item name="note" label="Ghi chú">
          <Input.TextArea
            rows={3}
            placeholder="Ghi chú thêm..."
            maxLength={500}
            showCount
          />
        </Form.Item>
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Hủy</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isPending}
            style={{ background: "#C17B3F", borderColor: "#C17B3F" }}
          >
            Tạo nhật ký
          </Button>
        </div>
      </Form>
    </Modal>
  );
};