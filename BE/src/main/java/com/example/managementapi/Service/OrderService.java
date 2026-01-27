package com.example.managementapi.Service;


import com.example.managementapi.Component.GenerateRandomCode;
import com.example.managementapi.Component.MethodConverter;
import com.example.managementapi.Dto.Request.Order.*;
import com.example.managementapi.Dto.Response.Notification.NotificationRes;
import com.example.managementapi.Dto.Response.Order.*;
import com.example.managementapi.Dto.Response.User.GetUserListOrder;
import com.example.managementapi.Entity.*;
import com.example.managementapi.Enum.*;
import com.example.managementapi.Exception.AppException;
import com.example.managementapi.Mapper.OrderMapper;
import com.example.managementapi.Repository.*;
import com.example.managementapi.Specification.OrderSpecification;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.weaver.ast.Or;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderService {

    private final UserRepository userRepository;

    private final OrderRepository orderRepository;

    private final CartRepository cartRepository;

    private final GenerateRandomCode orderCodeGenerator;

    private final PaymentRepository paymentRepository;

    private final ProductRepository productRepository;

    private final EmailService emailService;

    private final OrderMapper orderMapper;

    private final VnPayService vnPayService;

    private final FileService fileService;

    private final MethodConverter methodConverter;

    private final SimpMessagingTemplate messagingTemplate;

    private final NotificationsRepository notificationsRepository;

    private final UserDeviceRepository deviceRepo;

    private final UserNotificationsRepository userNotificationsRepository;

    private final String adminEmail = "kienphongtran2003@gmail.com";

    private final String storeName = "Cửa Hàng ABC";

    private final String orderManagementUrl = "https://yourstore.com/admin/orders/";

    private final String adminName = "Đội ngũ Admin";

    private final String processingDeadline = "24 giờ";

    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_USER')")
    public Page<GetUserListOrder> getUserListOrders(String userId, String status, Pageable pageable){
        Specification<Order> spec = OrderSpecification.filterByUserIdAndStatus(userId, status);
        return orderRepository.findAll(spec, pageable)
                .map(order -> orderMapper.toGetUserListOrder(order));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF')")
    public Page<GetAllOrdersRes> getAllOrders( String keyword, String status, Pageable pageable){
        Specification<Order> spec = OrderSpecification.searchOrder(keyword,status);
        return orderRepository.findAll(spec, pageable)
                .map(order -> orderMapper.toGetAllOrdersRes(order));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF', 'ROLE_USER')")
    public GetUserOrdersDetailRes getUserOrderDetails(String orderId){

        var order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        return orderMapper.toGetUserOrdersDetailRes(order);
    }

    @Transactional
    @PreAuthorize("hasRole('ROLE_USER')")
    public CreateOrderFromCartRes createOrderFromCart(String userId, String cartId){

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Cart is empty, cannot create order");
        }

        if (cart.getTotalPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Cart total price must be greater than 0");
        }

        for (CartItem cartItem : cart.getCartItems()) {
            if (cartItem.getQuantity() > cartItem.getProduct().getProductQuantity()) {
                throw new IllegalStateException("Product " + cartItem.getProduct().getProductName() + " is out of stock");
            }
        }

        Order order = Order.builder()
                .user(user)
                .orderCode(orderCodeGenerator.generateOrderCode())
                .shipAddress(user.getUserAddress())
                .orderStatus(OrderStatus.Pending)
                .createBy(user.getUserName())
                .orderAmount(cart.getTotalPrice())
                .total_quantity(cart.getTotalQuantity())
                .createAt(LocalDateTime.now())
                .build();

        List<OrderItem> orderItems = cart.getCartItems().stream()
                .map(cartItem -> {
                    Product product = cartItem.getProduct();

                    return OrderItem.builder()
                            .order(order)
                            .productId(product.getProductId())
                            .productName(product.getProductName())
                            .productCode(product.getProductCode())
                            .productImage(new ArrayList<>(product.getProductImage()))
                            .productVolume(product.getProductVolume())
                            .productUnit(product.getProductUnit())
                            .productQuantity(product.getProductQuantity())
                            .productPrice(product.getProductPrice())
                            .discount(product.getDiscount())
                            .colorName(product.getColor().getColorName())
                            .categoryName(product.getCategory().getCategoryName())
                            .quantity(cartItem.getQuantity())
                            .price(product.getProductPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())))
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
    @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_ADMIN','ROLE_STAFF')")
    public UpdateOrderByUserRes confirmOrderByUser(String userId,
                                                   String orderId,
                                                   UpdateOrderReq request,
                                                   HttpServletRequest httpRequest) throws UnsupportedEncodingException {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order userOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Optional<UserDevice> deviceOpt = deviceRepo.findFirstByUserIdAndSocketIdIsNotNull(userId);


        if (!userOrder.getUser().getId().equals(userId)) {
            throw new RuntimeException("Order " + orderId + " not found in user " + user.getUserName());
        }

        Payment payment = userOrder.getPayment();

        Cart cart = user.getCart();

        String paymentUrl = null;

        if (request.getPaymentMethod() == PaymentMethod.CASH)
        {

            userOrder.setShipAddress(request.getShipAddress());

            userOrder.setUpdateBy(user.getUserName());

            userOrder.setUpdateAt(LocalDateTime.now());

            payment.setPaymentStatus(PaymentMethodStatus.Paid);

            paymentRepository.save(payment);

            orderRepository.save(userOrder);

            if(cart != null){
                cart.getCartItems().clear();
                cart.setTotalQuantity(0);
                cart.setTotalPrice(BigDecimal.ZERO);

                cartRepository.save(cart);
            }

            List<UserNotifications> savedUserNotis = new ArrayList<>();

            List<User> admins = userRepository.findDistinctByRoles_NameIn(
                    List.of("ADMIN", "STAFF")
            );

            Notifications noti = notificationsRepository.save(Notifications.builder()
                    .title("Order Confirmation!")
                    .message(user.getUserName()+" has successfully confirm their order!")
                    .type("Order!")
                    .createBy(user.getUserName())
                    .build());

            for (User admin : admins) {

                UserNotifications un = UserNotifications.builder()
                        .notifications(noti)
                        .userId(admin.getId())
                        .isRead(false)
//                    .deliveredAt(LocalDateTime.now())
                        .status(UserNotifactionStatus.DELIVERED)
                        .sendChannel(UserNotifactionSendChannel.WEB)
                        .build();
                try{
                    String sessionId = deviceOpt.get().getSocketId();

                    NotificationRes payload = NotificationRes.builder()
                            .notificationId(noti.getNotificationId())
                            .title(noti.getTitle())
                            .message(noti.getMessage())
                            .type(noti.getType())
                            .createdAt(noti.getCreatedAt())
                            .build();

                    String personalQueue = "/queue/notifications-user" + sessionId;
                    messagingTemplate.convertAndSend(personalQueue, payload);

                    log.info("✅ Đã gửi realtime notification đến user [{}]", userId);

                } catch (RuntimeException e) {
                    throw new RuntimeException("There is something wrong!");
                }

                savedUserNotis.add(un);
            }

            userNotificationsRepository.saveAll(savedUserNotis);

        }

        if(request.getPaymentMethod() == PaymentMethod.VN_PAY)
        {
            userOrder.getPayment().setPaymentMethod(request.getPaymentMethod());

            userOrder.setShipAddress(request.getShipAddress());

            userOrder.setUpdateBy(user.getUserName());

            userOrder.setUpdateAt(LocalDateTime.now());

            paymentUrl = vnPayService.createOrder(httpRequest, orderId);

            log.warn("PAYMENT URL: " + paymentUrl);
            payment.setPaymentStatus(PaymentMethodStatus.Pending);

            paymentRepository.save(payment);

            orderRepository.save(userOrder);

        }
        UpdateOrderByUserRes orderResponse = orderMapper.toGetOrderResponse(userOrder);

        orderResponse.setPaymentUrl(paymentUrl);

        emailService.sendOrderNotificationToAdmin(adminEmail,
                orderResponse,
                storeName,
                orderManagementUrl,
                adminName,
                processingDeadline);


        return orderResponse;

    }


    @Transactional
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public String approveOrder(String userId, String orderId, ApproveOrderReq request) throws MessagingException {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));


        Optional<UserDevice> deviceOpt = deviceRepo.findFirstByUserIdAndSocketIdIsNotNull(userId);


        List<OrderItem> orderItemsList = order.getOrderItems();

        Cart cart = user.getCart();

        UpdateOrderByUserRes orderResponse = orderMapper.toGetOrderResponse(order);


        if(request.getOrderStatus() == OrderStatus.Approved){

            order.setOrderStatus(OrderStatus.Approved);

            order.setApprovedBy(user.getUserName());

            order.setCompleteAt(LocalDateTime.now());

            orderRepository.save(order);

            for (OrderItem orderItem : orderItemsList) {
                String productId = orderItem.getProductId();
                Product getProduct = productRepository.findByProductId(productId);
                if (getProduct == null) {
                    throw new RuntimeException("Product not found for order item");
                }
                int newQuantity = getProduct.getProductQuantity()  - orderItem.getQuantity();
                if (newQuantity < 0) {
                    throw new RuntimeException("Insufficient product quantity for " + orderItem.getProductName());
                }
                getProduct.setProductQuantity(newQuantity);
                productRepository.save(getProduct);
            }

            if(cart != null){
                cart.getCartItems().clear();
                cart.setTotalQuantity(0);
                cart.setTotalPrice(BigDecimal.ZERO);

                cartRepository.save(cart);
            }

            Notifications noti = notificationsRepository.save(Notifications.builder()
                    .title("Order's status approved!")
                    .message("Your order has been approved !")
                    .type("Order!")
                    .createBy("Admin")
                    .build());


                UserNotifications un = UserNotifications.builder()
                        .notifications(noti)
                        .userId(user.getId())
                        .isRead(false)
                        .status(UserNotifactionStatus.PENDING)
                        .sendChannel(UserNotifactionSendChannel.WEB)
                        .build();
                try{
                    String sessionId = deviceOpt.get().getSocketId();

                    NotificationRes payload = NotificationRes.builder()
                            .notificationId(noti.getNotificationId())
                            .title(noti.getTitle())
                            .message(noti.getMessage())
                            .type(noti.getType())
                            .createdAt(noti.getCreatedAt())
                            .build();

                    String personalQueue = "/queue/notifications-user" + sessionId;
                    messagingTemplate.convertAndSend(personalQueue, payload);

                    log.info("✅ Đã gửi realtime notification đến user [{}]", userId);

                } catch (RuntimeException e) {
                    throw new RuntimeException("There is something wrong!");
                }


            userNotificationsRepository.save(un);


            emailService.sendOrderApprovedEmail(orderResponse);

            return "Approved Order Successfully!";

        } else if (request.getOrderStatus() == OrderStatus.Canceled) {

            order.setOrderStatus(OrderStatus.Canceled);

            order.setCanceledBy(user.getUserName());

            order.setUpdateAt(LocalDateTime.now());

            order.setDeletedAt(LocalDateTime.now());

            order.setCompleteAt(LocalDateTime.now());

            orderRepository.save(order);

            if(cart != null){
                cart.getCartItems().clear();
                cart.setTotalQuantity(0);
                cart.setTotalPrice(BigDecimal.ZERO);
                cartRepository.save(cart);
            }

            Notifications noti = notificationsRepository.save(Notifications.builder()
                    .title("Order's status canceled!")
                    .message("Your order has been canceled !")
                    .type("Order!")
                    .createBy("Admin")
                    .build());

            UserNotifications un = UserNotifications.builder()
                    .notifications(noti)
                    .userId(user.getId())
                    .isRead(false)
//                    .deliveredAt(LocalDateTime.now())
                    .status(UserNotifactionStatus.PENDING)
                    .sendChannel(UserNotifactionSendChannel.WEB)
                    .build();
            try{
                String sessionId = deviceOpt.get().getSocketId();

                NotificationRes payload = NotificationRes.builder()
                        .notificationId(noti.getNotificationId())
                        .title(noti.getTitle())
                        .message(noti.getMessage())
                        .type(noti.getType())
                        .createdAt(noti.getCreatedAt())
                        .build();

                String personalQueue = "/queue/notifications-user" + sessionId;
                messagingTemplate.convertAndSend(personalQueue, payload);

                log.info("✅ Đã gửi realtime notification đến user [{}]", userId);

            } catch (RuntimeException e) {
                throw new RuntimeException("There is something wrong!");
            }


            userNotificationsRepository.save(un);

            emailService.sendOrderCanceledEmail(orderResponse);

            return "Canceled Order Successfully!";
        } else {
            throw new RuntimeException("Unsupported order status: " + request.getOrderStatus());
        }
    }


    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public CreateOrderResponse CreateOrderByAdmin(String adminUserId, CreateOrderRequest request) throws MessagingException {

        User adminUser = userRepository.findById(adminUserId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        User customer = adminUser;
        if (request.getId() != null) {
            customer = userRepository.findById(request.getId()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        }

        Order order = orderMapper.toOrder(request);
        order.setCreateAt(LocalDateTime.now());
        order.setOrderStatus(OrderStatus.Pending);
        order.setOrderCode(orderCodeGenerator.generateOrderCode());
        order.setCreateBy(adminUser.getUserName());
        order.setUser(customer);

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        int totalQuantity = 0;

        for (GetProductQuantityRequest itemReq : request.getOrderItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product does not exist"));

            if (itemReq.getQuantity() > product.getProductQuantity()) {
                throw new RuntimeException("Product quantity is not enough for this order");
            }

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
                    .quantity(product.getProductQuantity())
                    .price(product.getProductPrice())
                    .createAt(LocalDateTime.now())
                    .build();

            orderItems.add(orderItem);

            totalAmount = totalAmount.add(product.getProductPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity())));
            totalQuantity += itemReq.getQuantity();

            productRepository.save(product);
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
        response.setFirstName(savedOrder.getUser().getFirstName());

        UpdateOrderByUserRes orderResponse = orderMapper.toGetOrderResponse(savedOrder);

        emailService.sendOrderCreatedByAdminEmail(
                customer.getEmail(),
                customer.getFirstName(),
                savedOrder.getOrderCode(),
                savedOrder.getCreateAt(),
                savedOrder.getOrderStatus().name(),
                savedOrder.getOrderAmount(),
                savedOrder.getOrderItems(),
                "Tên công ty ABC",
                "support@abc.com",
                "0123-456-789",
                "https://abc.com"
        );

        return response;
    }


    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public UpdateOrderByAdminResponse updateOrderByAdmin(String orderId, UpdateOrderByAdminRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        orderMapper.updateOrder(order, request);

        Payment payment = order.getPayment();
        if(request.getPaymentMethod() != null){
            payment.setPaymentMethod(request.getPaymentMethod());
            paymentRepository.save(payment);
        }

        if(request.getId() != null){
            User user = userRepository.findById(request.getId()).orElseThrow(() -> new RuntimeException("User not found"));
            order.setUser(user);
        }
        orderRepository.save(order);
        return orderMapper.toUpdateOrderByAdminResponse(order);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public byte[] exportExcelFileByGetOrdersFromUserAndDateRange(ExportFileReq req) throws IOException {

        userRepository.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate startDate = methodConverter.parseDate(req.getStartDate());
        LocalDate endDate = methodConverter.parseDate(req.getEndDate());

        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.plusDays(1).atStartOfDay();

        List<Order> orders = orderRepository
                .findOrdersByUserAndDateRange(req.getUserId(), start, end);

        return fileService.generateExcelReport(orders, req.getStartDate(), req.getEndDate());
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public void deleteOrder(String id){
        orderRepository.deleteById(id);
    }


}
