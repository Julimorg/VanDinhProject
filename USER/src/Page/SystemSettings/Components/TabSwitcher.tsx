// // import ChangeInformation from './ChangeInformation';
// import ChangePassword from './ChangePassword';
// interface TabSwitcherProps {
//   activeTab: string;
//   onChange: (tab: string) => void;
// }

// const TabSwitcher = ({ activeTab, onChange }: TabSwitcherProps) => {
//   return (
//     <div className="border w-full border-gray-300 rounded-lg bg-white p-2">
//       <div className="flex bg-gray-200 rounded-lg p-2 gap-2">
//         {/* <button
//           className={`flex-1 py-2 font-bold rounded-md transition ${
//             activeTab === 'DoiThongTin'
//               ? 'bg-blue-400 text-white'
//               : 'bg-gray-100 text-gray-800 hover:bg-gray-300'
//           }`}
//           onClick={() => onChange('DoiThongTin')}
//         >
//           Đổi thông tin
//         </button> */}
//         <button
//           className={`flex-1 py-2 font-bold rounded-md transition ${
//             activeTab === 'DoiMatKhau'
//               ? 'bg-blue-400 text-white'
//               : 'bg-gray-100 text-gray-800 hover:bg-gray-300'
//           }`}
//           onClick={() => onChange('DoiMatKhau')}
//         >
//           Đổi mật khẩu
//         </button>
//       </div>
//             <div className="mt-6">
//         {/* {activeTab === 'DoiThongTin' && <ChangeInformation />} */}
//         {activeTab === 'DoiMatKhau' && <ChangePassword />}
//       </div>
//     </div>
//   );
// };

// export default TabSwitcher;
