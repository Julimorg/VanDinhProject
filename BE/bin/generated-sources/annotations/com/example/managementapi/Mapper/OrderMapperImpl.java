package com.example.managementapi.Mapper;

import com.example.managementapi.Dto.Request.Order.CreateOrderRequest;
import com.example.managementapi.Dto.Request.Order.GetProductQuantityRequest;
import com.example.managementapi.Dto.Request.Order.UpdateOrderByAdminRequest;
import com.example.managementapi.Dto.Response.Order.CreateOrderFromCartRes;
import com.example.managementapi.Dto.Response.Order.CreateOrderItemsResponse;
import com.example.managementapi.Dto.Response.Order.CreateOrderPaymentResponse;
import com.example.managementapi.Dto.Response.Order.CreateOrderResponse;
import com.example.managementapi.Dto.Response.Order.GetAllOrdersRes;
import com.example.managementapi.Dto.Response.Order.GetUserOrdersDetailRes;
import com.example.managementapi.Dto.Response.Order.SearchOrderItemResponse;
import com.example.managementapi.Dto.Response.Order.SearchOrdersResponse;
import com.example.managementapi.Dto.Response.Order.UpdateOrderByAdminResponse;
import com.example.managementapi.Dto.Response.Order.UpdateOrderByUserRes;
import com.example.managementapi.Dto.Response.Order.UpdateOrderItemByAdminResponse;
import com.example.managementapi.Dto.Response.User.GetUserListOrder;
import com.example.managementapi.Dto.Response.User.OrderInGetUserDetailByAdminRes;
import com.example.managementapi.Dto.Response.User.OrderInGetUserDetailRes;
import com.example.managementapi.Entity.Order;
import com.example.managementapi.Entity.OrderItem;
import com.example.managementapi.Entity.Payment;
import com.example.managementapi.Entity.User;
import com.example.managementapi.Enum.OrderStatus;
import com.example.managementapi.Enum.PaymentMethod;
import com.example.managementapi.Enum.PaymentMethodStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoField;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeConstants;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-10T10:06:48+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class OrderMapperImpl implements OrderMapper {

    @Autowired
    private OrderItemMapper orderItemMapper;
    private final DatatypeFactory datatypeFactory;

    public OrderMapperImpl() {
        try {
            datatypeFactory = DatatypeFactory.newInstance();
        }
        catch ( DatatypeConfigurationException ex ) {
            throw new RuntimeException( ex );
        }
    }

    @Override
    public GetUserListOrder toGetUserListOrder(Order order) {
        if ( order == null ) {
            return null;
        }

        GetUserListOrder.GetUserListOrderBuilder getUserListOrder = GetUserListOrder.builder();

        PaymentMethod paymentMethod = orderPaymentPaymentMethod( order );
        if ( paymentMethod != null ) {
            getUserListOrder.paymentMethod( paymentMethod.name() );
        }
        getUserListOrder.completeAt( order.getCompleteAt() );
        getUserListOrder.createAt( order.getCreateAt() );
        getUserListOrder.deletedAt( order.getDeletedAt() );
        getUserListOrder.orderAmount( order.getOrderAmount() );
        getUserListOrder.orderCode( order.getOrderCode() );
        getUserListOrder.orderId( order.getOrderId() );
        getUserListOrder.orderStatus( order.getOrderStatus() );
        getUserListOrder.shipAddress( order.getShipAddress() );
        getUserListOrder.total_quantity( order.getTotal_quantity() );
        getUserListOrder.updateAt( order.getUpdateAt() );

        return getUserListOrder.build();
    }

    @Override
    public SearchOrdersResponse toSearchOrdersResponse(Order orders) {
        if ( orders == null ) {
            return null;
        }

        SearchOrdersResponse.SearchOrdersResponseBuilder searchOrdersResponse = SearchOrdersResponse.builder();

        searchOrdersResponse.status( orders.getOrderStatus() );
        searchOrdersResponse.amount( orders.getOrderAmount() );
        searchOrdersResponse.userId( ordersUserId( orders ) );
        searchOrdersResponse.email( ordersUserEmail( orders ) );
        searchOrdersResponse.phone( ordersUserPhone( orders ) );
        searchOrdersResponse.userAddress( ordersUserUserAddress( orders ) );
        searchOrdersResponse.paymentMethod( orderPaymentPaymentMethod( orders ) );
        PaymentMethodStatus paymentStatus = ordersPaymentPaymentStatus( orders );
        if ( paymentStatus != null ) {
            searchOrdersResponse.paymentStatus( paymentStatus.name() );
        }
        searchOrdersResponse.paymentId( ordersPaymentPaymentId( orders ) );
        searchOrdersResponse.orderItems( orderItemListToSearchOrderItemResponseList( orders.getOrderItems() ) );
        searchOrdersResponse.completeAt( orders.getCompleteAt() );
        searchOrdersResponse.createAt( orders.getCreateAt() );
        searchOrdersResponse.deletedAt( orders.getDeletedAt() );
        searchOrdersResponse.orderCode( orders.getOrderCode() );
        searchOrdersResponse.orderId( orders.getOrderId() );
        searchOrdersResponse.updateAt( orders.getUpdateAt() );

        return searchOrdersResponse.build();
    }

    @Override
    public GetAllOrdersRes toGetAllOrdersRes(Order order) {
        if ( order == null ) {
            return null;
        }

        GetAllOrdersRes.GetAllOrdersResBuilder getAllOrdersRes = GetAllOrdersRes.builder();

        getAllOrdersRes.userId( ordersUserId( order ) );
        getAllOrdersRes.orderCode( order.getOrderCode() );
        getAllOrdersRes.status( order.getOrderStatus() );
        getAllOrdersRes.amount( order.getOrderAmount() );
        getAllOrdersRes.userName( orderUserUserName( order ) );
        getAllOrdersRes.email( ordersUserEmail( order ) );
        getAllOrdersRes.phone( ordersUserPhone( order ) );
        getAllOrdersRes.userAddress( ordersUserUserAddress( order ) );
        getAllOrdersRes.paymentMethod( orderPaymentPaymentMethod( order ) );
        getAllOrdersRes.createAt( order.getCreateAt() );
        getAllOrdersRes.orderId( order.getOrderId() );
        getAllOrdersRes.updateAt( order.getUpdateAt() );

        return getAllOrdersRes.build();
    }

    @Override
    public GetUserOrdersDetailRes toGetUserOrdersDetailRes(Order order) {
        if ( order == null ) {
            return null;
        }

        GetUserOrdersDetailRes.GetUserOrdersDetailResBuilder getUserOrdersDetailRes = GetUserOrdersDetailRes.builder();

        getUserOrdersDetailRes.userId( ordersUserId( order ) );
        getUserOrdersDetailRes.orderCode( order.getOrderCode() );
        getUserOrdersDetailRes.status( order.getOrderStatus() );
        getUserOrdersDetailRes.amount( order.getOrderAmount() );
        getUserOrdersDetailRes.userName( orderUserUserName( order ) );
        getUserOrdersDetailRes.email( ordersUserEmail( order ) );
        getUserOrdersDetailRes.phone( ordersUserPhone( order ) );
        getUserOrdersDetailRes.userAddress( ordersUserUserAddress( order ) );
        getUserOrdersDetailRes.paymentMethod( orderPaymentPaymentMethod( order ) );
        getUserOrdersDetailRes.items( orderItemMapper.toOrderItemResList( order.getOrderItems() ) );
        getUserOrdersDetailRes.createAt( xmlGregorianCalendarToLocalDate( localDateTimeToXmlGregorianCalendar( order.getCreateAt() ) ) );
        getUserOrdersDetailRes.orderId( order.getOrderId() );
        getUserOrdersDetailRes.updateAt( xmlGregorianCalendarToLocalDate( localDateTimeToXmlGregorianCalendar( order.getUpdateAt() ) ) );

        return getUserOrdersDetailRes.build();
    }

    @Override
    public CreateOrderFromCartRes toCreateOrderFromCartRes(Order order) {
        if ( order == null ) {
            return null;
        }

        CreateOrderFromCartRes.CreateOrderFromCartResBuilder createOrderFromCartRes = CreateOrderFromCartRes.builder();

        createOrderFromCartRes.userId( ordersUserId( order ) );
        createOrderFromCartRes.orderCode( order.getOrderCode() );
        createOrderFromCartRes.status( order.getOrderStatus() );
        createOrderFromCartRes.amount( order.getOrderAmount() );
        createOrderFromCartRes.userName( orderUserUserName( order ) );
        createOrderFromCartRes.email( ordersUserEmail( order ) );
        createOrderFromCartRes.phone( ordersUserPhone( order ) );
        createOrderFromCartRes.userAddress( ordersUserUserAddress( order ) );
        createOrderFromCartRes.createBy( order.getCreateBy() );
        createOrderFromCartRes.paymentMethod( orderPaymentPaymentMethod( order ) );
        createOrderFromCartRes.paymentStatus( ordersPaymentPaymentStatus( order ) );
        createOrderFromCartRes.orderItems( orderItemMapper.toOrderItemResList( order.getOrderItems() ) );
        createOrderFromCartRes.createAt( order.getCreateAt() );
        createOrderFromCartRes.orderId( order.getOrderId() );
        createOrderFromCartRes.shipAddress( order.getShipAddress() );

        return createOrderFromCartRes.build();
    }

    @Override
    public Order toOrder(CreateOrderRequest request) {
        if ( request == null ) {
            return null;
        }

        Order.OrderBuilder order = Order.builder();

        order.orderCode( request.getOrderCode() );
        order.orderItems( getProductQuantityRequestListToOrderItemList( request.getOrderItems() ) );
        if ( request.getOrderStatus() != null ) {
            order.orderStatus( Enum.valueOf( OrderStatus.class, request.getOrderStatus() ) );
        }
        order.shipAddress( request.getShipAddress() );

        return order.build();
    }

    @Override
    public CreateOrderResponse toCreateOrderResponse(Order order) {
        if ( order == null ) {
            return null;
        }

        CreateOrderResponse.CreateOrderResponseBuilder createOrderResponse = CreateOrderResponse.builder();

        createOrderResponse.createAt( order.getCreateAt() );
        if ( order.getOrderAmount() != null ) {
            createOrderResponse.orderAmount( order.getOrderAmount().doubleValue() );
        }
        createOrderResponse.orderCode( order.getOrderCode() );
        createOrderResponse.orderId( order.getOrderId() );
        createOrderResponse.orderItems( orderItemListToCreateOrderItemsResponseList( order.getOrderItems() ) );
        if ( order.getOrderStatus() != null ) {
            createOrderResponse.orderStatus( order.getOrderStatus().name() );
        }
        createOrderResponse.payment( paymentToCreateOrderPaymentResponse( order.getPayment() ) );
        createOrderResponse.shipAddress( order.getShipAddress() );

        return createOrderResponse.build();
    }

    @Override
    public UpdateOrderByUserRes toGetOrderResponse(Order order) {
        if ( order == null ) {
            return null;
        }

        UpdateOrderByUserRes.UpdateOrderByUserResBuilder updateOrderByUserRes = UpdateOrderByUserRes.builder();

        updateOrderByUserRes.status( order.getOrderStatus() );
        updateOrderByUserRes.orderId( order.getOrderId() );
        updateOrderByUserRes.orderCode( order.getOrderCode() );
        updateOrderByUserRes.amount( order.getOrderAmount() );
        updateOrderByUserRes.userId( ordersUserId( order ) );
        updateOrderByUserRes.email( ordersUserEmail( order ) );
        updateOrderByUserRes.phone( ordersUserPhone( order ) );
        updateOrderByUserRes.userAddress( ordersUserUserAddress( order ) );
        updateOrderByUserRes.shipAddress( order.getShipAddress() );
        updateOrderByUserRes.paymentMethod( orderPaymentPaymentMethod( order ) );
        updateOrderByUserRes.paymentStatus( ordersPaymentPaymentStatus( order ) );
        updateOrderByUserRes.orderItems( orderItemMapper.toOrderItemResList( order.getOrderItems() ) );
        updateOrderByUserRes.createAt( order.getCreateAt() );
        updateOrderByUserRes.updateAt( order.getUpdateAt() );
        updateOrderByUserRes.completeAt( order.getCompleteAt() );

        return updateOrderByUserRes.build();
    }

    @Override
    public OrderInGetUserDetailByAdminRes toOrderInGetUserDetailByAdminRes(Order order) {
        if ( order == null ) {
            return null;
        }

        OrderInGetUserDetailByAdminRes.OrderInGetUserDetailByAdminResBuilder orderInGetUserDetailByAdminRes = OrderInGetUserDetailByAdminRes.builder();

        PaymentMethod paymentMethod = orderPaymentPaymentMethod( order );
        if ( paymentMethod != null ) {
            orderInGetUserDetailByAdminRes.paymentMethod( paymentMethod.name() );
        }
        orderInGetUserDetailByAdminRes.approvedBy( order.getApprovedBy() );
        orderInGetUserDetailByAdminRes.canceledBy( order.getCanceledBy() );
        orderInGetUserDetailByAdminRes.completeAt( order.getCompleteAt() );
        orderInGetUserDetailByAdminRes.createAt( order.getCreateAt() );
        orderInGetUserDetailByAdminRes.createBy( order.getCreateBy() );
        orderInGetUserDetailByAdminRes.deletedAt( order.getDeletedAt() );
        orderInGetUserDetailByAdminRes.orderAmount( order.getOrderAmount() );
        orderInGetUserDetailByAdminRes.orderCode( order.getOrderCode() );
        orderInGetUserDetailByAdminRes.orderId( order.getOrderId() );
        orderInGetUserDetailByAdminRes.orderStatus( order.getOrderStatus() );
        orderInGetUserDetailByAdminRes.shipAddress( order.getShipAddress() );
        orderInGetUserDetailByAdminRes.total_quantity( order.getTotal_quantity() );
        orderInGetUserDetailByAdminRes.updateAt( order.getUpdateAt() );
        orderInGetUserDetailByAdminRes.updateBy( order.getUpdateBy() );

        return orderInGetUserDetailByAdminRes.build();
    }

    @Override
    public OrderInGetUserDetailRes toOrderInGetUserDetailRes(Order order) {
        if ( order == null ) {
            return null;
        }

        OrderInGetUserDetailRes.OrderInGetUserDetailResBuilder orderInGetUserDetailRes = OrderInGetUserDetailRes.builder();

        PaymentMethod paymentMethod = orderPaymentPaymentMethod( order );
        if ( paymentMethod != null ) {
            orderInGetUserDetailRes.paymentMethod( paymentMethod.name() );
        }
        orderInGetUserDetailRes.completeAt( order.getCompleteAt() );
        orderInGetUserDetailRes.createAt( order.getCreateAt() );
        orderInGetUserDetailRes.deletedAt( order.getDeletedAt() );
        orderInGetUserDetailRes.orderAmount( order.getOrderAmount() );
        orderInGetUserDetailRes.orderCode( order.getOrderCode() );
        orderInGetUserDetailRes.orderId( order.getOrderId() );
        orderInGetUserDetailRes.orderStatus( order.getOrderStatus() );
        orderInGetUserDetailRes.shipAddress( order.getShipAddress() );
        orderInGetUserDetailRes.total_quantity( order.getTotal_quantity() );
        orderInGetUserDetailRes.updateAt( order.getUpdateAt() );

        return orderInGetUserDetailRes.build();
    }

    @Override
    public void updateOrder(Order order, UpdateOrderByAdminRequest request) {
        if ( request == null ) {
            return;
        }

        if ( order.getPayment() == null ) {
            order.setPayment( Payment.builder().build() );
        }
        updateOrderByAdminRequestToPayment( request, order.getPayment() );
        order.setShipAddress( request.getShipAddress() );
    }

    @Override
    public UpdateOrderByAdminResponse toUpdateOrderByAdminResponse(Order order) {
        if ( order == null ) {
            return null;
        }

        UpdateOrderByAdminResponse.UpdateOrderByAdminResponseBuilder updateOrderByAdminResponse = UpdateOrderByAdminResponse.builder();

        updateOrderByAdminResponse.createAt( order.getCreateAt() );
        updateOrderByAdminResponse.orderAmount( order.getOrderAmount() );
        updateOrderByAdminResponse.orderCode( order.getOrderCode() );
        updateOrderByAdminResponse.orderId( order.getOrderId() );
        updateOrderByAdminResponse.orderItems( orderItemListToUpdateOrderItemByAdminResponseList( order.getOrderItems() ) );
        if ( order.getOrderStatus() != null ) {
            updateOrderByAdminResponse.orderStatus( order.getOrderStatus().name() );
        }
        updateOrderByAdminResponse.shipAddress( order.getShipAddress() );
        updateOrderByAdminResponse.updateAt( order.getUpdateAt() );

        return updateOrderByAdminResponse.build();
    }

    private XMLGregorianCalendar localDateTimeToXmlGregorianCalendar( LocalDateTime localDateTime ) {
        if ( localDateTime == null ) {
            return null;
        }

        return datatypeFactory.newXMLGregorianCalendar(
            localDateTime.getYear(),
            localDateTime.getMonthValue(),
            localDateTime.getDayOfMonth(),
            localDateTime.getHour(),
            localDateTime.getMinute(),
            localDateTime.getSecond(),
            localDateTime.get( ChronoField.MILLI_OF_SECOND ),
            DatatypeConstants.FIELD_UNDEFINED );
    }

    private static LocalDate xmlGregorianCalendarToLocalDate( XMLGregorianCalendar xcal ) {
        if ( xcal == null ) {
            return null;
        }

        return LocalDate.of( xcal.getYear(), xcal.getMonth(), xcal.getDay() );
    }

    private PaymentMethod orderPaymentPaymentMethod(Order order) {
        if ( order == null ) {
            return null;
        }
        Payment payment = order.getPayment();
        if ( payment == null ) {
            return null;
        }
        PaymentMethod paymentMethod = payment.getPaymentMethod();
        if ( paymentMethod == null ) {
            return null;
        }
        return paymentMethod;
    }

    private String ordersUserId(Order order) {
        if ( order == null ) {
            return null;
        }
        User user = order.getUser();
        if ( user == null ) {
            return null;
        }
        String id = user.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String ordersUserEmail(Order order) {
        if ( order == null ) {
            return null;
        }
        User user = order.getUser();
        if ( user == null ) {
            return null;
        }
        String email = user.getEmail();
        if ( email == null ) {
            return null;
        }
        return email;
    }

    private String ordersUserPhone(Order order) {
        if ( order == null ) {
            return null;
        }
        User user = order.getUser();
        if ( user == null ) {
            return null;
        }
        String phone = user.getPhone();
        if ( phone == null ) {
            return null;
        }
        return phone;
    }

    private String ordersUserUserAddress(Order order) {
        if ( order == null ) {
            return null;
        }
        User user = order.getUser();
        if ( user == null ) {
            return null;
        }
        String userAddress = user.getUserAddress();
        if ( userAddress == null ) {
            return null;
        }
        return userAddress;
    }

    private PaymentMethodStatus ordersPaymentPaymentStatus(Order order) {
        if ( order == null ) {
            return null;
        }
        Payment payment = order.getPayment();
        if ( payment == null ) {
            return null;
        }
        PaymentMethodStatus paymentStatus = payment.getPaymentStatus();
        if ( paymentStatus == null ) {
            return null;
        }
        return paymentStatus;
    }

    private String ordersPaymentPaymentId(Order order) {
        if ( order == null ) {
            return null;
        }
        Payment payment = order.getPayment();
        if ( payment == null ) {
            return null;
        }
        String paymentId = payment.getPaymentId();
        if ( paymentId == null ) {
            return null;
        }
        return paymentId;
    }

    protected List<SearchOrderItemResponse> orderItemListToSearchOrderItemResponseList(List<OrderItem> list) {
        if ( list == null ) {
            return null;
        }

        List<SearchOrderItemResponse> list1 = new ArrayList<SearchOrderItemResponse>( list.size() );
        for ( OrderItem orderItem : list ) {
            list1.add( orderItemMapper.toSearchOrderItemResponse( orderItem ) );
        }

        return list1;
    }

    private String orderUserUserName(Order order) {
        if ( order == null ) {
            return null;
        }
        User user = order.getUser();
        if ( user == null ) {
            return null;
        }
        String userName = user.getUserName();
        if ( userName == null ) {
            return null;
        }
        return userName;
    }

    protected OrderItem getProductQuantityRequestToOrderItem(GetProductQuantityRequest getProductQuantityRequest) {
        if ( getProductQuantityRequest == null ) {
            return null;
        }

        OrderItem.OrderItemBuilder orderItem = OrderItem.builder();

        orderItem.productId( getProductQuantityRequest.getProductId() );
        orderItem.quantity( getProductQuantityRequest.getQuantity() );

        return orderItem.build();
    }

    protected List<OrderItem> getProductQuantityRequestListToOrderItemList(List<GetProductQuantityRequest> list) {
        if ( list == null ) {
            return null;
        }

        List<OrderItem> list1 = new ArrayList<OrderItem>( list.size() );
        for ( GetProductQuantityRequest getProductQuantityRequest : list ) {
            list1.add( getProductQuantityRequestToOrderItem( getProductQuantityRequest ) );
        }

        return list1;
    }

    protected CreateOrderItemsResponse orderItemToCreateOrderItemsResponse(OrderItem orderItem) {
        if ( orderItem == null ) {
            return null;
        }

        CreateOrderItemsResponse.CreateOrderItemsResponseBuilder createOrderItemsResponse = CreateOrderItemsResponse.builder();

        createOrderItemsResponse.createAt( orderItem.getCreateAt() );
        createOrderItemsResponse.deletedAt( orderItem.getDeletedAt() );
        createOrderItemsResponse.orderItemId( orderItem.getOrderItemId() );
        createOrderItemsResponse.price( orderItem.getPrice() );
        createOrderItemsResponse.quantity( orderItem.getQuantity() );
        createOrderItemsResponse.updateAt( orderItem.getUpdateAt() );

        return createOrderItemsResponse.build();
    }

    protected List<CreateOrderItemsResponse> orderItemListToCreateOrderItemsResponseList(List<OrderItem> list) {
        if ( list == null ) {
            return null;
        }

        List<CreateOrderItemsResponse> list1 = new ArrayList<CreateOrderItemsResponse>( list.size() );
        for ( OrderItem orderItem : list ) {
            list1.add( orderItemToCreateOrderItemsResponse( orderItem ) );
        }

        return list1;
    }

    protected CreateOrderPaymentResponse paymentToCreateOrderPaymentResponse(Payment payment) {
        if ( payment == null ) {
            return null;
        }

        CreateOrderPaymentResponse.CreateOrderPaymentResponseBuilder createOrderPaymentResponse = CreateOrderPaymentResponse.builder();

        createOrderPaymentResponse.paymentId( payment.getPaymentId() );
        if ( payment.getPaymentMethod() != null ) {
            createOrderPaymentResponse.paymentMethod( payment.getPaymentMethod().name() );
        }
        if ( payment.getPaymentStatus() != null ) {
            createOrderPaymentResponse.paymentStatus( payment.getPaymentStatus().name() );
        }

        return createOrderPaymentResponse.build();
    }

    protected void updateOrderByAdminRequestToPayment(UpdateOrderByAdminRequest updateOrderByAdminRequest, Payment mappingTarget) {
        if ( updateOrderByAdminRequest == null ) {
            return;
        }

        mappingTarget.setPaymentMethod( updateOrderByAdminRequest.getPaymentMethod() );
    }

    protected List<UpdateOrderItemByAdminResponse> orderItemListToUpdateOrderItemByAdminResponseList(List<OrderItem> list) {
        if ( list == null ) {
            return null;
        }

        List<UpdateOrderItemByAdminResponse> list1 = new ArrayList<UpdateOrderItemByAdminResponse>( list.size() );
        for ( OrderItem orderItem : list ) {
            list1.add( orderItemMapper.toUpdateOrderItemByAdminResponse( orderItem ) );
        }

        return list1;
    }
}
