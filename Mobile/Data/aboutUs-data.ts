
import techcombankQr from '../assets/products/product_1.png';

export const aboutData = {
  company: {
    name: "Cửa Hàng Sơn Vạn Dinh",
    address: "123 Đường ABC, Phường Dĩ An, TP. Dĩ An, Bình Dương",
    phone: "0123 456 789",
    email: "vandinh.paint@gmail.com",
    website: "https://vandinh.com", 
    description:
      "Vạn Dinh là cửa hàng phân phối sơn chính hãng hàng đầu khu vực với hơn 10 năm kinh nghiệm. Chúng tôi chuyên cung cấp các dòng sơn nội thất, ngoại thất, sơn chống thấm và sơn công nghiệp từ các thương hiệu uy tín như Dulux, Nippon, Jotun, Kansai, TOA.\n\nVới đội ngũ tư vấn chuyên nghiệp và dịch vụ hậu mãi chu đáo, Vạn Dinh luôn mang đến giải pháp sơn tối ưu về chất lượng, thẩm mỹ và chi phí cho mọi công trình lớn nhỏ.",
  },
  contact: {
    facebook: "https://facebook.com/vandinhpaint",
    zalo: "https://zalo.me/0123456789",
  },
  bankAccounts: [
    {
      id: 1,
      bankName: "Vietcombank",
      accountNumber: "1234 5678 9012 3456",
      owner: "NGUYEN VAN DINH",
    },
    {
      id: 2,
      bankName: "Techcombank",
      accountNumber: "9876 5432 1098 7654",
      owner: "NGUYEN VAN DINH",
    },
    {
      id: 3,
      bankName: "MB Bank",
      accountNumber: "0001234567890",
      owner: "NGUYEN VAN DINH",
    },
  ],

  qrCodes: [
    {
      id: 1,
      title: "Chuyển khoản Vietcombank",
      source: techcombankQr,
    },
    {
      id: 2,
      title: "Chuyển khoản Techcombank",
      source: techcombankQr,
    },
    {
      id: 3,
      title: "Liên hệ Zalo",
      source: techcombankQr,
    },
  ],
};