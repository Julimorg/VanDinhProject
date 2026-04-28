package com.example.service;
import com.example.common.dto.order.request.*;
import com.example.common.dto.order.response.*;
import com.example.common.enums.ErrorCode;
import com.example.common.enums.SuccessCode;
import com.example.common.exception.AppException;
import com.example.common.interfaces.cart.CartInternalService;
import com.example.common.interfaces.payment.PaymentInternalService;
import com.example.common.interfaces.products.ProductInternalService;
import com.example.common.interfaces.user.UserInternalService;
import com.example.common.util.GenerateRandomCode;
import com.example.common.util.MethodConverter;
import com.example.config.OrderSpecification;
import com.example.mapper.OrderMapper;
import com.example.persistence.entity.*;
import com.example.persistence.enumTable.*;
import com.example.repository.OrderRepository;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static com.example.persistence.enumTable.OrderStatus.Approved;
import static com.example.persistence.enumTable.PaymentMethodStatus.Canceled;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderMapper  orderMapper;

    private final OrderRepository orderRepository;

    private final MethodConverter methodConverter;

    private final UserInternalService userInternalService;

    private final CartInternalService cartInternalService;

    private final PaymentInternalService paymentInternalService;

    private final ProductInternalService productInternalService;

    private final GenerateRandomCode generateRandomCode;

    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_USER')")
    public Page<GetUserOrderRes> getUserOrderHistory(String userId,
                                                   String status,
                                                   Pageable pageable) {
        Specification<Order> spec = OrderSpecification
                .from(OrderSpecification
                        .OrderFilter
                        .forUser(userId, status));
        return orderRepository.findAll(spec, pageable)
                .map(orderMapper::toGetUserOrder);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF')")
    public Page<GetAllOrdersRes> getAllOrders(String keyword,
                                              String status,
                                              Pageable pageable){
        Specification<Order> spec = OrderSpecification
                .from(OrderSpecification
                        .OrderFilter
                        .forAdmin(keyword, status));
        return orderRepository.findAll(spec, pageable)
                .map(order -> orderMapper.toGetAllOrdersRes(order));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_USER')")
    public GetUserOrdersDetailRes getUserOrderDetails(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        return orderMapper.toGetUserOrdersDetailRes(order);
    }

    /*
    * SET DATA IN CART BACK TO DEFAULT
    * */
    private void clearCart(Cart cart) {
        if (cart == null) return;
        cart.getCartItems().clear();
        cart.setTotalQuantity(0);
        cart.setTotalPrice(BigDecimal.ZERO);
        cartInternalService.saveCartData(cart);
    }

    @Transactional
    @PreAuthorize("hasRole('ROLE_USER')")
    public CreateOrderFromCartRes createOrderFromCart(String userId, String cartId) {

        User user = userInternalService.getUserById(userId);

        Cart cart = cartInternalService.getCart(cartId);

        if (cart.getCartItems().isEmpty()) {
            throw new AppException(ErrorCode.CART_EMPTY);
        }

        if (cart.getTotalPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new AppException(ErrorCode.INVALID_CART_TOTAL);
        }

        for (CartItem cartItem : cart.getCartItems()) {
            if (cartItem.getQuantity() > cartItem.getProduct().getProductQuantity()) {
                throw new AppException(ErrorCode.PRODUCT_OUT_OF_STOCK);
//                cartItem.getProduct().getProductName()
            }
        }

        Order order = Order.builder()
                .user(user)
                .orderCode(generateRandomCode.generateOrderCode())
                .shipAddress(user.getUserAddress())
                .orderStatus(OrderStatus.Pending)
                .createBy(user.getUserName())
                .orderAmount(cart.getTotalPrice())
                .total_quantity(cart.getTotalQuantity())
                .createAt(LocalDateTime.now())
                .build();

        List<OrderItem> orderItems = cart.getCartItems().stream()
                .map(cartItem -> {
                    Product p = cartItem.getProduct();
                    return OrderItem.builder()
                            .order(order)
                            .productId(p.getProductId())
                            .productName(p.getProductName())
                            .productCode(p.getProductCode())
                            .productImage(new ArrayList<>(p.getProductImage()))
                            .productVolume(p.getProductVolume())
                            .productUnit(p.getProductUnit())
                            .productQuantity(p.getProductQuantity())
                            .productPrice(p.getProductPrice())
                            .discount(p.getDiscount())
                            .colorName(p.getColor().getColorName())
                            .categoryName(p.getCategory().getCategoryName())
                            .quantity(cartItem.getQuantity())
                            .price(p.getProductPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())))
                            .createAt(LocalDateTime.now())
                            .build();
                })
                .toList();

        Payment payment = Payment.builder()
                .paymentMethod(PaymentMethod.CASH)
                .amount(cart.getTotalPrice())
                .paymentStatus(PaymentMethodStatus.Pending)
                .order(order)
                .build();

        order.setOrderItems(orderItems);

        order.setPayment(payment);

        orderRepository.save(order);

        return orderMapper.toCreateOrderFromCartRes(order);
    }

    @Transactional
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN', 'ROLE_STAFF')")
    public UpdateOrderByUserRes confirmOrderByUser(String userId,
                                                   String orderId,
                                                   UpdateOrderReq request,
                                                   HttpServletRequest httpRequest) throws UnsupportedEncodingException {

        User user = userInternalService.getUserById(userId);

        Order userOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        if (!userOrder.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.ORDER_NOT_BELONG_TO_USER);
        }

        Payment payment = userOrder.getPayment();
        String paymentUrl = null;

        if (request.getPaymentMethod() == PaymentMethod.CASH) {

            userOrder.setShipAddress(request.getShipAddress());
            userOrder.setUpdateBy(user.getUserName());
            userOrder.setUpdateAt(LocalDateTime.now());
            orderRepository.save(userOrder);

            payment.setPaymentStatus(PaymentMethodStatus.Paid);

            paymentInternalService
                    .updatePaymentStatus(
                            orderId,
                            PaymentMethodStatus.Paid
                    );

            clearCart(user.getCart());

            // Gửi notification đến từng ADMIN/STAFF (đúng targetUserId từng người)
            List<User> admins = userInternalService
                    .findAllByRoles_NameIn(
                            List.of(UserRole.ADMIN.toString(),
                                    UserRole.STAFF.toString()
                            )
                    );

            // TODO
            //      --> Config Notification
            //            for (User admin : admins) {
            //                createAndSendNotification(
            //                        "Order Confirmation!",
            //                        user.getUserName() + " has successfully confirmed their order!",
            //                        "Order!",
            //                        user.getUserName(),
            //                        admin.getId(),
            //                        UserNotifactionStatus.DELIVERED
            //                );
            //            }
        }

        if (request.getPaymentMethod() == PaymentMethod.VN_PAY) {
            payment.setPaymentMethod(PaymentMethod.VN_PAY);
            userOrder.setShipAddress(request.getShipAddress());
            userOrder.setUpdateBy(user.getUserName());
            userOrder.setUpdateAt(LocalDateTime.now());

            // TODO
            //      --> Config VnPay
            //            paymentUrl = vnPayService.createOrder(httpRequest, orderId);
            log.info("VNPay payment URL created for order [{}]", orderId);

            orderRepository.save(userOrder);

            paymentInternalService
                    .updatePaymentMethod(
                            orderId,
                            PaymentMethod.VN_PAY,
                            PaymentMethodStatus.Pending
                    );

            // TODO
            //      --> Config VnPay
            //            paymentUrl = vnPayService.createOrder(httpRequest, orderId);
        }

        UpdateOrderByUserRes response = orderMapper.toGetOrderResponse(userOrder);
        response.setPaymentUrl(paymentUrl);

            //  TODO
            //        emailService.sendOrderNotificationToAdmin(
            //                adminEmail, response, storeName, orderManagementUrl, adminName, processingDeadline
            //        );

        return response;
    }

    @Transactional
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF')")
    public String approveOrder(String adminId,
                               String orderId,
                               ApproveOrderReq request) throws MessagingException {

        User admin = userInternalService.getUserById(adminId);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        User customer = order.getUser();

        UpdateOrderByUserRes orderResponse = orderMapper.toGetOrderResponse(order);

        return switch (request.getOrderStatus()) {
            case Approved -> handleApproveOrder(order, admin, customer, orderResponse);
            case Canceled -> handleCancelOrder(order, admin, customer, orderResponse);
            default -> throw new AppException(ErrorCode.UNSUPPORTED_ORDER_STATUS);
        };
    }

    private String handleApproveOrder(Order order,
                                      User admin,
                                      User customer,
                                      UpdateOrderByUserRes orderResponse)
            throws MessagingException {
        order.setOrderStatus(OrderStatus.Approved);
        order.setApprovedBy(admin.getUserName());
        order.setCompleteAt(LocalDateTime.now());
        orderRepository.save(order);

        for (OrderItem item : order.getOrderItems()) {

            Product product = productInternalService
                    .getProductById(item
                            .getProductId());

            int newQty = product.getProductQuantity() - item.getQuantity();

            if (newQty < 0) {
                throw new AppException(ErrorCode.INSUFFICIENT_STOCK);
            }
            product.setProductQuantity(newQty);

            productInternalService.saveProductData(product);
        }

        clearCart(customer.getCart());

//        createAndSendNotification(
//                "Order Approved!",
//                "Your order has been approved!",
//                "Order!",
//                admin.getUserName(),
//                customer.getId(),   // ✅ target đúng
//                UserNotifactionStatus.PENDING
//        );

//        emailService.sendOrderApprovedEmail(orderResponse);

        return SuccessCode.APPROVE_ORDER.getMessage();
    }

    private String handleCancelOrder(Order order,
                                     User admin,
                                     User customer,
                                     UpdateOrderByUserRes orderResponse)
            throws MessagingException {
        order.setOrderStatus(OrderStatus.Canceled);
        order.setCanceledBy(admin.getUserName());
        order.setUpdateAt(LocalDateTime.now());
        order.setDeletedAt(LocalDateTime.now());
        order.setCompleteAt(LocalDateTime.now());
        orderRepository.save(order);

        clearCart(customer.getCart());

//        // ✅ Gửi notification đến CUSTOMER
//        createAndSendNotification(
//                "Order Canceled!",
//                "Your order has been canceled!",
//                "Order!",
//                admin.getUserName(),
//                customer.getId(),   // ✅ target đúng
//                UserNotifactionStatus.PENDING
//        );
//
//        emailService.sendOrderCanceledEmail(orderResponse);
        return SuccessCode.CANCELED_ORDER.getMessage();
    }

    @Transactional
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF')")
    public UpdateOrderByAdminResponse updateOrderByAdmin(String orderId,
                                                          UpdateOrderByAdminRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        orderMapper.updateOrder(order, request);

        if (request.getPaymentMethod() != null) {

            order.getPayment().setPaymentMethod(request.getPaymentMethod());

            paymentInternalService.savePaymentData(order.getPayment());

        }

        if (request.getId() != null) {
            User user = userInternalService
                    .getUserById(request.getId());

            order.setUser(user);
        }

        orderRepository.save(order);
        return orderMapper.toUpdateOrderByAdminResponse(order);
    }

    @Transactional
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF')")
    public CreateOrderResponse createOrderByAdmin(String adminUserId,
                                                  CreateOrderRequest request) throws MessagingException {

        User adminUser = userInternalService.getUserById(adminUserId);

        User customer = (request.getId() != null)
                ? userInternalService.getUserById(adminUserId)
                : adminUser;

        Order order = orderMapper.toOrder(request);
        order.setCreateAt(LocalDateTime.now());
        order.setOrderStatus(OrderStatus.Pending);
        order.setOrderCode(generateRandomCode.generateOrderCode());
        order.setCreateBy(adminUser.getUserName());
        order.setUser(customer);

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        int totalQuantity = 0;

        for (GetProductQuantityRequest itemReq : request.getOrderItems()) {

            Product product = productInternalService.getProductById(itemReq.getProductId());

            if (itemReq.getQuantity() > product.getProductQuantity()) {
                throw new RuntimeException(ErrorCode.INSUFFICIENT_STOCK.getMessage()
                        + product.getProductName());
            }

            BigDecimal itemPrice = product.getProductPrice()
                    .multiply(BigDecimal.valueOf(itemReq.getQuantity()));

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .productId(product.getProductId())
                    .productName(product.getProductName())
                    .productCode(product.getProductCode())
                    .productImage(new ArrayList<>(product.getProductImage()))
                    .productVolume(product.getProductVolume())
                    .productUnit(product.getProductUnit())
                    .productPrice(product.getProductPrice())
                    .discount(product.getDiscount())
                    .colorName(product.getColor().getColorName())
                    .categoryName(product.getCategory().getCategoryName())
                    .quantity(itemReq.getQuantity())
                    .price(itemPrice)
                    .createAt(LocalDateTime.now())
                    .build();

            orderItems.add(orderItem);
            totalAmount = totalAmount.add(itemPrice);
            totalQuantity += itemReq.getQuantity();


        }

        order.setOrderItems(orderItems);
        order.setTotal_quantity(totalQuantity);
        order.setOrderAmount(totalAmount);

        Payment payment = new Payment();
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setOrder(order);
        order.setPayment(payment);
        order.setShipAddress(request.getShipAddress());

        Order savedOrder = orderRepository.save(order);

        CreateOrderResponse response = orderMapper.toCreateOrderResponse(savedOrder);
        response.setFirstName(customer.getFirstName());

//        emailService.sendOrderCreatedByAdminEmail(
//                customer.getEmail(),
//                customer.getFirstName(),
//                savedOrder.getOrderCode(),
//                savedOrder.getCreateAt(),
//                savedOrder.getOrderStatus().name(),
//                savedOrder.getOrderAmount(),
//                savedOrder.getOrderItems(),
//                "Tên công ty ABC",
//                "support@abc.com",
//                "0123-456-789",
//                "https://abc.com"
//        );

        return response;
    }

//    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF')")
//    public byte[] exportExcelFileByGetOrdersFromUserAndDateRange(ExportFileReq req) throws IOException {
//
//        userInternalService.getUserById(req.getUserId());
//
//
//        LocalDate startDate = methodConverter.parseDate(req.getStartDate());
//        LocalDate endDate = methodConverter.parseDate(req.getEndDate());
//
//        List<Order> orders = orderRepository.findOrdersByUserAndDateRange(
//                req.getUserId(),
//                startDate.atStartOfDay(),
//                endDate.plusDays(1).atStartOfDay()
//        );
//
//        return fileService.generateExcelReport(orders, req.getStartDate(), req.getEndDate());
//    }

    @Transactional
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF')")
    public void deleteOrder(String id) {
        if (!orderRepository.existsById(id)) {
            throw new AppException(ErrorCode.ORDER_NOT_FOUND);
        }
        orderRepository.deleteById(id);
    }

}
