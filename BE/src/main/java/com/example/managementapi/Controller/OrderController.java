package com.example.managementapi.Controller;

import com.example.managementapi.Dto.ApiResponse;
import com.example.managementapi.Dto.Request.Order.ApproveOrderReq;
import com.example.managementapi.Dto.Request.Order.CreateOrderRequest;
import com.example.managementapi.Dto.Request.Order.UpdateOrderByAdminRequest;
import com.example.managementapi.Dto.Request.Order.UpdateOrderReq;
import com.example.managementapi.Dto.Request.OrderItem.UpdateOrderItemRequest;
import com.example.managementapi.Dto.Response.Order.*;
import com.example.managementapi.Service.OrderItemService;
import com.example.managementapi.Service.OrderService;
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
    @GetMapping("/search-order")
    public ApiResponse<Page<SearchOrdersResponse>> searchOrdersByAdmin(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "orderStatus", required = false) String orderStatus,
            @PageableDefault(size = 10, sort = "orderAmount", direction = Sort.Direction.DESC) Pageable pageable){

        return ApiResponse.<Page<SearchOrdersResponse>>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(orderService.searchOrdersByAdmin(keyword, orderStatus, pageable))
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
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(orderService.getAllOrders(keyword,status, pageable))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/user-order/{userId}")
    public ApiResponse<Page<GetUserOrdersRes>> getUserOrders(
            @PathVariable String userId,
            @PageableDefault(size = 10, sort = "userId"
                    , direction = Sort.Direction.DESC) Pageable pageable) {
        return ApiResponse.<Page<GetUserOrdersRes>>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(orderService.getUserOrders(userId, pageable))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/order-detail/{userId}/{orderId}")
    public ApiResponse<GetUserOrdersDetailRes> getUserOrders(
            @PathVariable String userId,
            @PathVariable String orderId) {
        return ApiResponse.<GetUserOrdersDetailRes>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(orderService.getUserOrderDetails(userId,orderId))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @PostMapping("/from-cart/{userId}/{cartId}")
    public ApiResponse<CreateOrderFromCartRes> addProductToCart(@PathVariable String userId,
                                                          @PathVariable String cartId){
        return ApiResponse.<CreateOrderFromCartRes>builder()
                .status_code(HttpStatus.OK.value())
                .message("Create Order Approved!")
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
                .status_code(HttpStatus.OK.value())
                .message("Update Order Approved!")
                .data(orderService.confirmOrderByUser(userId, orderId, request, servletRequest))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @PatchMapping("/approve-order/{userId}/{orderId}")
    public ApiResponse<String> approveOrder(@PathVariable String userId,
                                              @PathVariable String orderId,
                                              @Valid @RequestBody ApproveOrderReq request) throws MessagingException {
        return ApiResponse.<String>builder()
                .status_code(HttpStatus.OK.value())
                .message(orderService.approveOrder(userId, orderId, request))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @PostMapping("/create-order/{userId}")
    public ApiResponse<CreateOrderResponse> createOrder(@PathVariable String userId, @RequestBody CreateOrderRequest request) throws MessagingException {
        return ApiResponse.<CreateOrderResponse>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(orderService.CreateOrderByAdmin(userId,request))
                .timestamp(LocalDateTime.now())

                .build();
    }

    //Update bởi admin
    @PatchMapping("/admin/update/{orderId}")
    public ApiResponse<UpdateOrderByAdminResponse> updateOrderByAdmin(
            @PathVariable String orderId,
            @Valid @RequestBody UpdateOrderByAdminRequest request) {

        return ApiResponse.<UpdateOrderByAdminResponse>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
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
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
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
