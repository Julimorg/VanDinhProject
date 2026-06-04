import React, { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import { useParams } from "react-router-dom";
import { GetDiaryRes } from "../Hooks/diary";
import { useUpdateDiary } from "../Hooks/useUpdateDiary";

interface UpdateDiaryModalProps {
  open: boolean;
  diary: GetDiaryRes | null;
  onClose: () => void;
}

const UpdateDiaryModal: React.FC<UpdateDiaryModalProps> = ({ open, diary, onClose }) => {
  const { userId } = useParams<{ userId: string }>();
  const [form] = Form.useForm();

  const { mutate: updateDiary, isPending } = useUpdateDiary();

  useEffect(() => {
    if (open && diary) {
      form.setFieldsValue({
        diaryName: diary.diaryName,
        note: diary.note ?? "",
      });
    }
  }, [open, diary]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    updateDiary(
      { userId: userId!, diaryId: diary!.id, payload: values },
      { onSuccess: onClose }
    );
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Chỉnh sửa nhật ký"
      footer={[
        <Button key="cancel" onClick={onClose} disabled={isPending}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isPending}
          onClick={handleSubmit}
          style={{ background: "#C17B3F", borderColor: "#C17B3F" }}
        >
          Lưu
        </Button>,
      ]}
      destroyOnClose
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="diaryName"
          label="Tên nhật ký"
          rules={[{ required: true, message: "Tên nhật ký không được để trống!" }]}
        >
          <Input placeholder="Nhập tên nhật ký" />
        </Form.Item>

        <Form.Item name="note" label="Ghi chú">
          <Input.TextArea
            placeholder="Nhập ghi chú (nếu có)"
            rows={4}
            showCount
            maxLength={500}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateDiaryModal;