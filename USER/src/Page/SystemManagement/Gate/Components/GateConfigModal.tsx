import type { TGate, TGateConfig } from '@/Interface/TGate';
import { Button, Form, Input, Modal, Spin, message, Select, Avatar } from 'antd';
import { useEffect, type FC } from 'react';
import { useConfigGateById } from '../Hooks/useQueryGate';
// import { useMQTT } from '@/Context/MQTTContext';
import type { TProduct } from '@/Interface/TProduct';
// import { GateCommand } from '@/Constant/Status';
import { useGetProductGate } from '../Hooks/useGetProducetGate';

interface GateConfigModalProps {
  open: boolean;
  onCancel: () => void;
  gate: TGate;
}

const GateConfigModal: FC<GateConfigModalProps> = ({ open, onCancel, gate }) => {
  const [form] = Form.useForm();
  const { getGateById, updateConfigGate } = useConfigGateById(gate.id);
  // const { publish } = useMQTT();
  const { data: productGate = [] } = useGetProductGate();

  useEffect(() => {
    if (getGateById.data?.data?.configs) {
      form.setFieldsValue({
        configs: getGateById.data.data.configs.map((config: TGateConfig) => ({
          key: config.key,
          value: config.value,
          defaultValue: config.defaultValue,
        })),
      });
    }
  }, [getGateById.data, form]);

  const handleProductSelect = (productId: string, productName: string, fieldName: number) => {
    form.setFieldsValue({
      configs: form.getFieldValue('configs').map((config: any, index: number) => {
        if (index === fieldName) {
          return {
            ...config,
            value: productId,
            defaultValue: productName,
          };
        }
        return config;
      }),
    });
  };

  const handleSubmit = async (values: { configs: TGateConfig[] }) => {
    try {
      console.log(values.configs);
      await updateConfigGate.mutateAsync(values.configs);
      message.success('Cập nhật cấu hình thành công');
      onCancel();
    } catch (error) {
      message.error('Không thể cập nhật cấu hình. Vui lòng thử lại.');
    }
  };

  // const handleApplyConfig = () => {
  //   try {
  //     publish(
  //       "command",
  //       JSON.stringify({
  //         cmd: GateCommand.SYNC_CONFIG,
  //         client_id: gate.serialNo,
  //       })
  //     );
  //     // console.log(
  //     //   "command",
  //     //   JSON.stringify({
  //     //     cmd: GateCommand.SYNC_CONFIG,
  //     //     client_id: gate.serialNo,
  //     //   })
  //     // );
  //     message.success("Đã gửi lệnh áp dụng cấu hình");
  //   } catch (error) {
  //     message.error("Không thể gửi lệnh áp dụng cấu hình. Vui lòng thử lại.");
  //   }
  // };

  if (getGateById.isLoading) {
    return (
      <Modal title={`Cấu hình cổng: ${gate.name}`} open={open} onCancel={onCancel} footer={null}>
        <div className="flex items-center justify-center h-40 ">
          <Spin size="large" />
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title={`Cấu hình cổng: ${gate.name}`}
      open={open}
      onCancel={onCancel}
      footer={null}
      className=" w-11/12  md:w-1/2 xl:w-[40%] "
      centered={true}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        name="configGate"
        initialValues={{
          configs: getGateById.data?.data.configs || [],
        }}
        className=" max-h-[90vh]  overflow-y-auto"
      >
        <Form.List name="configs">
          {(fields) => (
            <>
              {fields.map(({ key, name, ...restField }) => {
                const configKey = form.getFieldValue(['configs', name, 'key']);
                const isServiceIdConfig = configKey === 'SERVICE_ID';

                return (
                  <div key={key} className="p-4 mb-4 border border-gray-200 rounded-lg ">
                    <Form.Item
                      {...restField}
                      name={[name, 'key']}
                      label="Key Config"
                      rules={[{ required: true, message: 'Vui lòng nhập ' }]}
                    >
                      <Input
                        readOnly
                        placeholder="Nhập key config"
                        className="cursor-not-allowed"
                        disabled
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'value']}
                      label="Giá trị"
                      rules={[{ required: true, message: 'Vui lòng nhập giá trị' }]}
                    >
                      {isServiceIdConfig ? (
                        <Select
                          virtual={false}
                          placeholder="Chọn sản phẩm"
                          showSearch
                          optionFilterProp="label"
                          onChange={(value: string, option: any) =>
                            handleProductSelect(value, option.name, name)
                          }
                        >
                          {productGate.map((product: TProduct) => (
                            <Select.Option
                              key={product.id}
                              value={product.id.toString()}
                              name={product.name}
                              label={product.name}
                            >
                              <div className="flex items-center gap-2">
                                {product.resources && product.resources[0] && (
                                  <Avatar
                                    src={`${import.meta.env.VITE_BASE_URL_SADEC_ADMIN}/${
                                      product.resources[0]
                                    }`}
                                    size="small"
                                  />
                                )}
                                <span>{product.name}</span>
                              </div>
                            </Select.Option>
                          ))}
                        </Select>
                      ) : (
                        <Input placeholder="Nhập giá trị" />
                      )}
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'defaultValue']}
                      label="Giá trị mặc định"
                      rules={[{ required: true, message: 'Vui lòng nhập ' }]}
                    >
                      <Input.TextArea placeholder="Nhập giá trị mặc định " />
                    </Form.Item>
                  </div>
                );
              })}
            </>
          )}
        </Form.List>

        <div className="flex justify-between gap-2 ">
          <Button danger onClick={onCancel} className="flex-1 ">
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={updateConfigGate.isPending}
            className="flex-1 "
          >
            Lưu
          </Button>
          {/* <Button
            variant="solid"
            color="gold"
            onClick={handleApplyConfig}
            className="flex-1 "
          >
            Áp dụng
          </Button> */}
        </div>
      </Form>
    </Modal>
  );
};

export default GateConfigModal;
