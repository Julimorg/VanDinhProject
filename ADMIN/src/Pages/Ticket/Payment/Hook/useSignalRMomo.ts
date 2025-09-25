import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const useSignalRPaymentListener = (cartId?: string | null) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!cartId) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://zen-api.stlsolution.com/paymentIpnHub", {
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection
      .start()
      .then(() => {
        console.log(" SignalR connected");

        
        connection.invoke("JoinGroup", cartId)
          .then(() => console.log(`joined group: ${cartId}`))
          .catch((err) => console.error(" Error joining group:", err));
      })
      .catch((err) => console.error(" SignalR connection error:", err));

   
    connection.on("PaymentSuccess", (data) => {
      console.log(" PaymentSuccess received:", data);
      if (data?.orderId === cartId) {
        toast.success(`Đơn hàng ${cartId} đã thanh toán thành công!`);
        navigate("/ticket");
      }
    });

    connection.on("PaymentFailed", (data) => {
      console.log("PaymentFailed received:", data);
      if (data?.orderId === cartId) {
        toast.error(`Thanh toán thất bại cho đơn hàng ${cartId}`);
      }
    });

    connection.on("PaymentCancelled", (data) => {
      console.log("PaymentCancelled received:", data);
      if (data?.orderId === cartId) {
        toast.warn(`Đơn hàng ${cartId} đã bị huỷ.`);
      }
    });

  
    return () => {
      connection.stop().then(() => console.log(" SignalR disconnected"));
    };
  }, [cartId]);
};
