// // File: src/components/Color/ViewColorDetailModal.tsx
// import React from 'react';
// import { Modal, Descriptions, Image } from 'antd';
// import type { Color } from './ColorList'; // Giả sử import Color interface từ ColorList

// interface ViewColorDetailModalProps {
//   visible: boolean;
//   onCancel: () => void;
//   color: Color;
// }

// const ViewColorDetailModal: React.FC<ViewColorDetailModalProps> = ({
//   visible,
//   onCancel,
//   color,
// }) => {
//   return (
//     <Modal
//       title="Chi tiết mã màu"
//       open={visible}
//       onOk={onCancel}
//       onCancel={onCancel}
//       okText="Đóng"
//       width={600}
//     >
//       <Descriptions bordered column={1}>
//         {/* <Descriptions.Item label="ID màu">{color.colorId}</Descriptions.Item> */}
//         <Descriptions.Item label="Tên màu">{color.colorName}</Descriptions.Item>
//         <Descriptions.Item label="Mã màu">{color.colorCode}</Descriptions.Item>
//         <Descriptions.Item label="Mô tả">{color.colorDescription}</Descriptions.Item>
//         <Descriptions.Item label="Hình ảnh màu">
//           <Image src={color.colorImg} width={100} alt={color.colorName} />
//         </Descriptions.Item>
//         <Descriptions.Item label="Nhà cung cấp">{color.supplierName || 'N/A'}</Descriptions.Item>
//         <Descriptions.Item label="Ngày tạo">{color.createAt}</Descriptions.Item>
//         <Descriptions.Item label="Ngày cập nhật">{color.updateAt}</Descriptions.Item>
//       </Descriptions>
//     </Modal>
//   );
// };

// export default ViewColorDetailModal;