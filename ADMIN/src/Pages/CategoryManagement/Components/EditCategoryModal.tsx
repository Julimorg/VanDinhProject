import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Upload, Button, Image, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { useUpdateCategory } from "../Hook/useUpdateCategory";
import type { IUpdateCategoryRequest } from "@/Interface/Category/IUpdateCategory";

interface EditCategoryModalProps {
    open: boolean;
    categoryId: string;
    initialData?: {
        categoryName: string;
        categoryDescription: string;
        categoryImage: string;
    };
    onCancel: () => void;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
    open,
    categoryId,
    initialData,
    onCancel,
}) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const { mutate, isPending } = useUpdateCategory(categoryId, {
        onSuccess: () => {
            message.success("Cập nhật danh mục thành công!");
            onCancel();
        },
        onError: (error) => {
            message.error(`Cập nhật thất bại: ${error.message}`);
        },
    });

    useEffect(() => {
        if (initialData) {
            form.setFieldsValue({
                categoryName: initialData.categoryName,
                categoryDescription: initialData.categoryDescription,
            });

            if (initialData.categoryImage) {
                setFileList([
                    {
                        uid: "-1",
                        name: "current-image",
                        status: "done",
                        url: initialData.categoryImage,
                    },
                ]);
            }
        }
    }, [initialData, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            if (fileList.length === 0 || !fileList[0].originFileObj) {
                message.error("Vui lòng chọn hình ảnh danh mục!");
                return;
            }

            const body: IUpdateCategoryRequest = {
                categoryName: values.categoryName,
                categoryDescription: values.categoryDescription,
                categoryImage: fileList[0].originFileObj as File,
            };

            mutate(body);
        } catch (error) {
            console.log("Validation failed:", error);
        }
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Tải ảnh</div>
        </div>
    );

    return (
        <Modal
            open={open}
            title="Cập nhật danh mục"
            okText="Cập nhật"
            cancelText="Hủy"
            onCancel={onCancel}
            onOk={handleSubmit}
            confirmLoading={isPending}
            centered
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="categoryName"
                    label="Tên danh mục"
                    rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
                >
                    <Input placeholder="Nhập tên danh mục" />
                </Form.Item>

                <Form.Item
                    name="categoryDescription"
                    label="Mô tả danh mục"
                    rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
                >
                    <Input.TextArea rows={3} placeholder="Nhập mô tả" />
                </Form.Item>

                <Form.Item label="Ảnh danh mục" required>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            beforeUpload={() => false}
                            onChange={({ fileList }) => setFileList(fileList)}
                            maxCount={1}
                        >
                            {fileList.length >= 1 ? null : uploadButton}
                        </Upload>

                        {fileList.length === 1 && fileList[0].url && (
                            <Image
                                src={fileList[0].url}
                                alt="Preview"
                                width={80}
                                height={80}
                                className="rounded-md object-cover border"
                                preview
                            />
                        )}
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditCategoryModal;
