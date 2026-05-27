// import React from "react";
// import { ConfigProvider, message } from "antd";
// import POItemsTable from "./Components/PurchaseItemsTablet";
// import POInfoCards from "./Components/PurchaseOrderDetailCard";
// import PODetailHeader from "./Components/PurchaseOrderDetailHeader";
// import { MOCK_PURCHASE_ORDER_DETAIL } from "./data";

// const PurchaseOrderDetailPage: React.FC = () => {
//   // Khi tích hợp API: thay MOCK_PURCHASE_ORDER_DETAIL bằng data từ useQuery(purchaseOrderId)
//   const data = MOCK_PURCHASE_ORDER_DETAIL;

//   return (
//     <ConfigProvider
//       theme={{
//         token: {
//           colorPrimary: "#4F46E5",
//           borderRadius: 8,
//           fontFamily: "'Inter', system-ui, sans-serif",
//         },
//       }}
//     >
//       <div className="min-h-screen" style={{ background: "#F4F5F7" }}>
//         <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5">

//           {/* Header: back + title + actions */}
//           <PODetailHeader
//             data={data}
//             onBack={() => message.info("Quay lại danh sách")}
//             onEdit={() => message.info("Chỉnh sửa phiếu")}
//             onApprove={() => message.success("Đã duyệt phiếu")}
//             onCancel={() => message.error("Đã huỷ phiếu")}
//             onPrint={() => window.print()}
//           />

//           {/* Stat cards + info grid */}
//           <POInfoCards data={data} />

//           {/* Items table */}
//           <POItemsTable items={data.items} />

//         </div>
//       </div>
//     </ConfigProvider>
//   );
// };

// export default PurchaseOrderDetailPage;