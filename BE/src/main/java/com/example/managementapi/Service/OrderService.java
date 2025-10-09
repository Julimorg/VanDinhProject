package com.example.managementapi.Service;


import com.example.managementapi.Component.GenerateRandomCode;
import com.example.managementapi.Dto.Request.Order.*;
import com.example.managementapi.Dto.Response.Order.*;
import com.example.managementapi.Entity.*;
import com.example.managementapi.Enum.OrderStatus;
import com.example.managementapi.Enum.PaymentMethod;
import com.example.managementapi.Enum.PaymentMethodStatus;
import com.example.managementapi.Mapper.OrderMapper;
import com.example.managementapi.Repository.*;
import com.example.managementapi.Specification.OrderSpecification;
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

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    private final String adminEmail = "kienphongtran2003@gmail.com";

    private final String storeName = "Cửa Hàng ABC";

    private final String orderManagementUrl = "https://yourstore.com/admin/orders/";

    private final String adminName = "Đội ngũ Admin";

    private final String processingDeadline = "24 giờ";


    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF')")
    public Page<SearchOrdersResponse> searchOrdersByAdmin(String keyword, String orderStatus, Pageable pageable){
        Specification<Order> specification = OrderSpecification.searchOrder(keyword, orderStatus);
        Page<Order> orders = orderRepository.findAll(specification, pageable);

        return orders.map(order -> orderMapper.toSearchOrdersResponse(order));
    }


    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF')")
    public Page<GetAllOrdersRes> getAllOrders( String keyword, String status, Pageable pageable){
        Specification<Order> spec = OrderSpecification.searchOrder(keyword,status);
        return orderRepository.findAll(spec, pageable)
                .map(order -> orderMapper.toGetAllOrdersRes(order));
    }

    //** Method này làm hơi dư thừa
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF','ROLE_USER')")
    public Page<GetUserOrdersRes> getUserOrders(String userId, Pageable pageable){

        User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

        Page<Order> ordersPage = orderRepository.findByUser(user, pageable);

        return ordersPage.map(orders -> orderMapper.toGetUserOrdersRes(orders));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public GetUserOrdersDetailRes getUserOrderDetails(String userId, String orderId){

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        return orderMapper.toGetUserOrdersDetailRes(
                orderRepository.findByUserAndOrderId(user, orderId)
                        .orElseThrow(() -> new RuntimeException("Order not found")));
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
                .map(cartItem -> OrderItem.builder()
                        .order(order)
                        .product(cartItem.getProduct())
                        .quantity(cartItem.getQuantity())
                        .price(cartItem.getProduct().getProductPrice())
                        .createAt(cartItem.getCreateAt())
                        .build())
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

        if (!userOrder.getUser().getId().equals(userId)) {
            throw new RuntimeException("Order " + orderId + " not found in user " + user.getUserName());
        }

        Payment payment = userOrder.getPayment();

        String paymentUrl = null;

        if (request.getPaymentMethod() == PaymentMethod.CASH)
        {

            userOrder.setShipAddress(request.getShipAddress());

            userOrder.setUpdateBy(user.getUserName());

            userOrder.setUpdateAt(LocalDateTime.now());

            payment.setPaymentStatus(PaymentMethodStatus.Paid);

            paymentRepository.save(payment);

            orderRepository.save(userOrder);
        }

        if(request.getPaymentMethod() == PaymentMethod.VN_PAY)
        {
            userOrder.getPayment().setPaymentMethod(request.getPaymentMethod());

            userOrder.setShipAddress(request.getShipAddress());

            userOrder.setUpdateBy(user.getUserName());

            userOrder.setUpdateAt(LocalDateTime.now());

            paymentUrl = vnPayService.createOrder(httpRequest, orderId);

            log.warn("PAYMENT URL: " + paymentUrl);
            payment.setPaymentStatus(PaymentMethodStatus.Paid);

            for (OrderItem orderItem : userOrder.getOrderItems()) {
                Product product = orderItem.getProduct();
                int reduceQuantity = product.getProductQuantity() - orderItem.getQuantity();
                product.setProductQuantity(reduceQuantity);
                productRepository.save(product);
            }

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


        List<OrderItem> orderItemsList = order.getOrderItems();

        Cart cart = user.getCart();

        UpdateOrderByUserRes orderResponse = orderMapper.toGetOrderResponse(order);

        if(request.getOrderStatus() == OrderStatus.Approved){

            order.setOrderStatus(OrderStatus.Approved);

            order.setApprovedBy(user.getUserName());

            order.setApprovedBy(user.getUserName());

            order.setCompleteAt(LocalDateTime.now());

            orderRepository.save(order);

            for (OrderItem orderItem : orderItemsList) {
                Product product = orderItem.getProduct();
                if (product == null) {
                    throw new RuntimeException("Product not found for order item");
                }
                int newQuantity = product.getProductQuantity() - orderItem.getQuantity();
                if (newQuantity < 0) {
                    throw new RuntimeException("Insufficient product quantity for " + product.getProductName());
                }
                product.setProductQuantity(newQuantity);
                productRepository.save(product);
            }

            cart.getCartItems().clear();
            cart.setTotalQuantity(0);
            cart.setTotalPrice(BigDecimal.ZERO);

            cartRepository.save(cart);

            emailService.sendOrderApprovedEmail(orderResponse);

            return "Approved Order Successfully!";

        } else if (request.getOrderStatus() == OrderStatus.Canceled) {

            order.setOrderStatus(OrderStatus.Canceled);

            order.setCanceledBy(user.getUserName());

            order.setUpdateAt(LocalDateTime.now());

            order.setDeletedAt(LocalDateTime.now());

            cart.getCartItems().clear();

            cart.setTotalQuantity(0);

            cart.setTotalPrice(BigDecimal.ZERO);

            order.setCompleteAt(LocalDateTime.now());

            emailService.sendOrderCanceledEmail(orderResponse);

            return "Canceled Order Successfully!";
        } else {
            throw new RuntimeException("Unsupported order status: " + request.getOrderStatus());
        }
    }


    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public CreateOrderResponse CreateOrderByAdmin(String userId, CreateOrderRequest request) throws MessagingException {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = orderMapper.toOrder(request);

        order.setCreateAt(LocalDateTime.now());

        order.setOrderStatus(OrderStatus.Pending);

        order.setOrderCode(orderCodeGenerator.generateOrderCode());

        order.setCreateBy(user.getUserName());

        List<OrderItem> orderItems = new ArrayList<>();

        BigDecimal totalAmount = BigDecimal.ZERO;
        int totalQuantity = 0;

        for(GetProductQuantityRequest itemReq : request.getOrderItems()){
            Product product = productRepository.findById(itemReq.getProductId()).orElseThrow(() -> new RuntimeException("Product does not exist"));

            if(itemReq.getQuantity() > product.getProductQuantity()){
                throw new RuntimeException("Product quantity is not enough for this order");
            }

            productRepository.save(product);

            OrderItem orderItem = new OrderItem();


            orderItem.setProduct(product);
            orderItem.setQuantity(itemReq.getQuantity());
            orderItem.setPrice(product.getProductPrice());
            orderItem.setCreateAt(LocalDateTime.now());

            orderItem.setOrder(order);

            orderItems.add(orderItem);

            BigDecimal totalItem = product.getProductPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            totalAmount = totalAmount.add(totalItem);
            totalQuantity += itemReq.getQuantity();
        }

        order.setUser(user);

        Payment payment = new Payment();
        payment.setPaymentMethod(PaymentMethod.VN_PAY);

        order.setTotal_quantity(totalQuantity);
        order.setOrderItems(orderItems);
        order.setOrderAmount(totalAmount);
        order.setPayment(payment);

        Order savedOrder = orderRepository.save(order);
        CreateOrderResponse response = orderMapper.toCreateOrderResponse(savedOrder);
        response.setFirstName(savedOrder.getUser().getFirstName());

        UpdateOrderByUserRes orderResponse = orderMapper.toGetOrderResponse(savedOrder);

        emailService.sendOrderCreatedByAdminEmail(
                user.getEmail(),
                user.getFirstName(),
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

        orderRepository.save(order);
        return orderMapper.toUpdateOrderByAdminResponse(order);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public void deleteOrder(String id){
        orderRepository.deleteById(id);
    }


}
