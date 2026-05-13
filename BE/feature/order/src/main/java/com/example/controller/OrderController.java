    package com.example.controller;
    import com.example.common.dto.order.request.*;
    import com.example.common.dto.order.response.*;
    import com.example.common.enums.SuccessCode;
    import com.example.common.response.ApiResponse;
    import com.example.service.OrderItemService;
    import com.example.service.OrderService;
    import jakarta.mail.MessagingException;
    import jakarta.servlet.http.HttpServletRequest;
    import jakarta.validation.Valid;
    import lombok.RequiredArgsConstructor;
    import org.springframework.data.domain.Page;
    import org.springframework.data.domain.Pageable;
    import org.springframework.data.domain.Sort;
    import org.springframework.data.web.PageableDefault;
    import org.springframework.http.HttpStatus;
    import org.springframework.web.bind.annotation.*;

    import java.io.UnsupportedEncodingException;
    import java.time.LocalDateTime;
    import java.util.List;

    @RestController
    @RequiredArgsConstructor
    @RequestMapping("api/v1/order")
    public class OrderController {

        private final OrderService orderService;

        private final OrderItemService orderItemService;

        @GetMapping("/list-orders/{userId}")
        public ApiResponse<Page<GetUserOrderRes>> getUserListOrders (
                @PathVariable String userId,
                @RequestParam(required = false) String status,
                @PageableDefault(size = 10, sort = "createAt"
                        , direction = Sort.Direction.DESC) Pageable pageable
                ){
            return ApiResponse.<Page<GetUserOrderRes>>builder()
                    .status_code(SuccessCode.GET_USER_ORDER.getStatusCode().value())
                    .message(SuccessCode.GET_USER_ORDER.getMessage())
                    .data(orderService.getUserOrderHistory(userId, status, pageable))
                    .timestamp(LocalDateTime.now())
                    .build();
        }

        @GetMapping("/user-order")
        public ApiResponse<Page<GetAllOrdersRes>> getAllOrders(
                @RequestParam(required = false) String keyword,
                @RequestParam(required = false) String status,
                @PageableDefault(size = 10, sort = "createAt"
                        , direction = Sort.Direction.DESC) Pageable pageable) {
            return ApiResponse.<Page<GetAllOrdersRes>>builder()
                    .status_code(SuccessCode.GET_ALL_ORDER.getStatusCode().value())
                    .message(SuccessCode.GET_ALL_ORDER.getMessage())
                    .data(orderService.getAllOrders(keyword,status, pageable))
                    .timestamp(LocalDateTime.now())
                    .build();
        }

        @GetMapping("/order-detail/{orderId}")
        public ApiResponse<GetUserOrdersDetailRes> getUserOrders(
                @PathVariable String orderId) {
            return ApiResponse.<GetUserOrdersDetailRes>builder()
                    .status_code(SuccessCode.GET_ORDER_DETAIL.getStatusCode().value())
                    .message(SuccessCode.GET_ORDER_DETAIL.getMessage())
                    .data(orderService.getUserOrderDetails(orderId))
                    .timestamp(LocalDateTime.now())
                    .build();
        }

        @PostMapping("/from-cart/{userId}/{cartId}")
        public ApiResponse<CreateOrderFromCartRes> addProductToCart(@PathVariable String userId,
                                                                    @PathVariable String cartId){
            return ApiResponse.<CreateOrderFromCartRes>builder()
                    .status_code(SuccessCode.CREATE_ORDER.getStatusCode().value())
                    .message(SuccessCode.CREATE_ORDER.getMessage())
                    .data(orderService.createOrderFromCart(userId, cartId))
                    .timestamp(LocalDateTime.now())
                    .build();
        }

        @PatchMapping("/confirm-order/{userId}/{orderId}")
        public ApiResponse<UpdateOrderByUserRes> confirmOrderByUser(@PathVariable String userId,
                                                                    @PathVariable String orderId,
                                                                    @Valid @RequestBody UpdateOrderReq request,
                                                                    HttpServletRequest servletRequest)
                throws UnsupportedEncodingException {
            return ApiResponse.<UpdateOrderByUserRes>builder()
                    .status_code(SuccessCode.UPDATE_ORDER.getStatusCode().value())
                    .message(SuccessCode.UPDATE_ORDER.getMessage())
                    .data(orderService.confirmOrderByUser(userId, orderId, request, servletRequest))
                    .timestamp(LocalDateTime.now())
                    .build();
        }

        @PatchMapping("/approve-order/{userId}/{orderId}")
        public ApiResponse<String> approveOrder(@PathVariable String userId,
                                                  @PathVariable String orderId,
                                                  @Valid @RequestBody ApproveOrderReq request) throws MessagingException {
            return ApiResponse.<String>builder()
                    .status_code(SuccessCode.APPROVE_ORDER.getStatusCode().value())
                    .message(SuccessCode.APPROVE_ORDER.getMessage())
                    .data(orderService.approveOrder(userId, orderId, request))
                    .timestamp(LocalDateTime.now())
                    .build();
        }

        @PostMapping("/create-order/{userId}")
        public ApiResponse<CreateOrderResponse> createOrder(@PathVariable String userId,
                                                            @RequestBody CreateOrderRequest request) throws MessagingException {
            return ApiResponse.<CreateOrderResponse>builder()
                    .status_code(SuccessCode.CREATE_ORDER.getStatusCode().value())
                    .message(SuccessCode.CREATE_ORDER.getMessage())
                    .data(orderService.createOrderByAdmin(userId,request))
                    .timestamp(LocalDateTime.now())

                    .build();
        }

        //Update bởi admin
        @PatchMapping("/admin/update/{orderId}")
        public ApiResponse<UpdateOrderByAdminResponse> updateOrderByAdmin(
                @PathVariable String orderId,
                @Valid @RequestBody UpdateOrderByAdminRequest request) {

            return ApiResponse.<UpdateOrderByAdminResponse>builder()
                    .status_code(SuccessCode.UPDATE_ORDER_BY_ADMIN.getStatusCode().value())
                    .message(SuccessCode.UPDATE_ORDER_BY_ADMIN.getMessage())
                    .data(orderService.updateOrderByAdmin(orderId, request))
                    .timestamp(LocalDateTime.now())
                    .build();
        }

        @PatchMapping("/admin/update-order-item/{orderId}")
        public ApiResponse<List<UpdateOrderItemByAdminResponse>> updateOrderItems(
                @PathVariable String orderId,
                @RequestBody UpdateOrderItemRequest request) {
            List<UpdateOrderItemByAdminResponse> updatedItems = orderItemService.updateOrderItems(orderId, request);

            return ApiResponse.<List<UpdateOrderItemByAdminResponse>>builder()
                    .status_code(SuccessCode.UPDATE_ORDER_ITEM.getStatusCode().value())
                    .message(SuccessCode.UPDATE_ORDER_ITEM.getMessage())
                    .data(updatedItems)
                    .timestamp(LocalDateTime.now())

                    .build();
        }


        @DeleteMapping("delete/{orderId}")
        public ApiResponse<String> deleteOrder(@PathVariable String orderId){
            orderService.deleteOrder(orderId);
            return ApiResponse.<String>builder()
                    .status_code(HttpStatus.OK.value())
                    .message("Deleted order ID: " + orderId)
                    .timestamp(LocalDateTime.now())
                    .build();
        }
    }
