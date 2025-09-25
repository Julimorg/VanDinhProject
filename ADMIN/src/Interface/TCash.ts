export type OrderSuccessResponse = {
  data: {
    qrBill: string;   
    qrTicket: string; 
  };
  stCode: number;     
  msg: string;        
};
