package com.example.managementapi.Service;
import com.example.managementapi.Dto.Request.Cart.AddItemToCartReq;
import com.example.managementapi.Dto.Request.Cart.UpdateCartItemQuantityReq;
import com.example.managementapi.Dto.Response.Cart.CartItemDetailRes;
import com.example.managementapi.Dto.Response.Cart.GetCartRes;
import com.example.managementapi.Dto.Response.Product.ProductForCartItem;
import com.example.managementapi.Entity.Cart;
import com.example.managementapi.Entity.CartItem;
import com.example.managementapi.Entity.Product;
import com.example.managementapi.Entity.User;
import com.example.managementapi.Mapper.CartMapper;
import com.example.managementapi.Repository.CartItemRepository;
import com.example.managementapi.Repository.CartRepository;
import com.example.managementapi.Repository.ProductRepository;
import com.example.managementapi.Repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class CartService {

    private final UserRepository userRepository;

    private final CartRepository cartRepository;

    private final CartItemRepository cartItemRepository;

    private final CartMapper cartMapper;

    private final ProductRepository productRepository;

    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_STAFF' , 'ROLE_ADMIN')")
    public GetCartRes getCart(String userId) {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));


        List<CartItemDetailRes> cartItemDetailResList = cart.getCartItems().stream()
                .map(ci -> CartItemDetailRes.builder()
                        .cartItemId(ci.getCartItemId())
                        .cartId(ci.getCart().getCartId())
                        .product(ProductForCartItem.builder()
                                .productId(ci.getProduct().getProductId())
                                .productName(ci.getProduct().getProductName())
                                .productImage(ci.getProduct().getProductImage())
                                .productVolume(ci.getProduct().getProductVolume())
                                .productUnit(ci.getProduct().getProductUnit())
                                .productCode(ci.getProduct().getProductCode())
                                .productQuantity(ci.getQuantity())
                                .discount(ci.getProduct().getDiscount())
                                .productPrice(ci.getProduct().getProductPrice())
                                .colorName(ci.getProduct().getColors().getColorCode())
                                .categoryName(ci.getProduct().getCategory().getCategoryName())
                                .build())
                        .createAt(ci.getCreateAt())
                        .updateAt(ci.getUpdateAt())
                        .build())
                .toList();

        return GetCartRes
                .builder()
                .cartId(cart.getCartId())
                .userId(userId)
                .totalPrice(cart.getTotalPrice())
                .totalQuantity(cart.getTotalQuantity())
                .createdAt(cart.getCreateAt())
                .updatedAt(cart.getUpdateAt())
                .items(cartItemDetailResList)
                .build();

    }


    @Transactional
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_STAFF' , 'ROLE_ADMIN')")
    public GetCartRes addProductToCart(String userId, AddItemToCartReq request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        //? Check Cart đã có chưa -> Nếu chưa thì tạo Cart
        Cart cart = cartRepository.findByUserId(userId).orElseGet(() -> {
            log.info("Đang tạo Cart");
            Cart newCart = Cart.builder()
                    .user(user)
                    .totalQuantity(0)
                    .totalPrice(BigDecimal.ZERO )
                    .cartItems(new ArrayList<>())
                    .createAt(LocalDateTime.now())
                    .updateAt(LocalDateTime.now())
                    .build();
            log.info("Tạo Cart thành công");
            user.setCart(newCart);
            return cartRepository.save(newCart);
        });

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (request.getQuantity() > product.getProductQuantity() || request.getQuantity() < 0) {
            throw new RuntimeException("Cannot add more quantity for product " + product.getProductName());
        }

        //? Check Product đã có trong Cart hay chưa
        //? Sẽ đi từ Cart -> CartItem -> Product -> ProductID
        Optional<CartItem> existingProductInCart = cart
                .getCartItems()
                .stream()
                .filter(cartItem -> cartItem.getProduct().getProductId().equals(request.getProductId()))
                .findFirst();

        CartItem cartItem;

        //?  Nếu Product tồn tại trong Cart rồi thì chỉ cần Update lại Quantity của Product đó thôi
        //? Nếu không thì build CartItem
        if (existingProductInCart.isPresent()) {
            cartItem = existingProductInCart.get();
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
            cartItem.setUpdateAt(LocalDateTime.now());
        } else {
            cartItem = CartItem
                    .builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .createAt(LocalDateTime.now())
                    .updateAt(LocalDateTime.now())
                    .build();
            cart.getCartItems().add(cartItem);
        }
        //? Tính tổng lại toàn bộ Quantity trong CartItem

        //? cách viết truyền thống
        //        int totalQuantity = 0;
        //        for(CartItem item  : cart.getCartItems()) {
        //            totalQuantity += item.getQuantity();
        //        }
        //        cart.setTotalQuantity(totalQuantity);
        cart.setTotalQuantity(
                cart.getCartItems().stream()
                        .mapToInt(item -> item.getQuantity()).sum()
        );

        //? Tính tổng giá tiền theo product.price * product quantity
        //? sau đó dùng sum() để cộng lại toàn bộ mà thôi
//        BigDecimal totalAmount = BigDecimal.ZERO;
//        for(CartItem item : cart.getCartItems()) {
//            BigDecimal price = item.getProduct().getProductPrice();
//            BigDecimal quantity = BigDecimal.valueOf(item.getQuantity());
//            totalAmount = totalAmount.add(price.multiply(quantity));
//        }
        cart.setTotalPrice(
                cart.getCartItems().stream()
                        .map(item -> item.getProduct().getProductPrice()
                                .multiply(BigDecimal.valueOf(item.getQuantity())))
                        .reduce(BigDecimal.ZERO, BigDecimal::add)
        );

        Cart savedCart = cartRepository.save(cart);

        List<CartItemDetailRes> cartItemDetailResList = savedCart.getCartItems().stream()
                .map(ci -> CartItemDetailRes.builder()
                        .cartItemId(ci.getCartItemId())
                        .cartId(savedCart.getCartId())
                        .product(ProductForCartItem.builder()
                                .productId(ci.getProduct().getProductId())
                                .productName(ci.getProduct().getProductName())
                                .productImage(ci.getProduct().getProductImage())
                                .productVolume(ci.getProduct().getProductVolume())
                                .productUnit(ci.getProduct().getProductUnit())
                                .productCode(ci.getProduct().getProductCode())
                                .productQuantity(ci.getQuantity())
                                .discount(ci.getProduct().getDiscount())
                                .productPrice(ci.getProduct().getProductPrice())
                                .colorName(ci.getProduct().getColors().getColorCode())
                                .categoryName(ci.getProduct().getCategory().getCategoryName())
                                .build())
                        .createAt(ci.getCreateAt())
                        .updateAt(ci.getUpdateAt())
                        .build())
                .toList();

        return GetCartRes.builder()
                .cartId(savedCart.getCartId())
                .userId(userId)
                .totalPrice(savedCart.getTotalPrice())
                .totalQuantity(savedCart.getTotalQuantity())
                .createdAt(savedCart.getCreateAt())
                .updatedAt(savedCart.getUpdateAt())
                .items(cartItemDetailResList)
                .build();
    }

    @Transactional
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_STAFF' , 'ROLE_ADMIN')")
    public CartItemDetailRes updateCartItem(String cartItemId, UpdateCartItemQuantityReq request){

        CartItem cartItem = cartItemRepository
                .findById(cartItemId).orElseThrow(() -> new RuntimeException("CartItem not found"));

        Product product = cartItem.getProduct();

        Cart cart = cartItem.getCart();


        if (request.getQuantity() > product.getProductQuantity() || request.getQuantity() < 0) {
            throw new RuntimeException("Cannot add more quantity for product " + product.getProductName());
        }

        cartItem.setQuantity(request.getQuantity());

        cartItem.setUpdateAt(LocalDateTime.now());


        //? update lại total_quantity và total_price
        cart.setTotalQuantity(
                cart.getCartItems().stream()
                        .mapToInt(item -> item.getQuantity()).sum()
        );

        cart.setTotalPrice(
                cart.getCartItems().stream()
                        .map(item -> item.getProduct().getProductPrice()
                                .multiply(BigDecimal.valueOf(item.getQuantity())))
                        .reduce(BigDecimal.ZERO, BigDecimal::add)
        );

        Cart savedCart = cartRepository.save(cart);

       return CartItemDetailRes.builder()
                        .cartItemId(savedCart.getCartId())
                        .cartId(savedCart.getCartId())
                        .product(ProductForCartItem.builder()
                                .productId(cartItem.getProduct().getProductId())
                                .productName(cartItem.getProduct().getProductName())
                                .productImage(cartItem.getProduct().getProductImage())
                                .productVolume(cartItem.getProduct().getProductVolume())
                                .productUnit(cartItem.getProduct().getProductUnit())
                                .productCode(cartItem.getProduct().getProductCode())
                                .productQuantity(cartItem.getProduct().getProductQuantity())
                                .discount(cartItem.getProduct().getDiscount())
                                .productPrice(cartItem.getProduct().getProductPrice())
                                .colorName(cartItem.getProduct().getColors().getColorName())
                                .categoryName(cartItem.getProduct().getCategory().getCategoryName())
                                .build())
                        .createAt(savedCart.getCreateAt())
                        .updateAt(savedCart.getUpdateAt())
                        .build();
    }

    @Transactional
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_STAFF' , 'ROLE_ADMIN')")
    public void deleteCartItem(String cartItemId){
        CartItem cartItem = cartItemRepository
                .findById(cartItemId).orElseThrow(() -> new RuntimeException("Product not found!"));

        Cart cart = cartItem.getCart();

        //? update lại total_price và total_quantity
        int totalQuantityAfterDeleteCartItem = cart.getTotalQuantity() - cartItem.getQuantity();

        BigDecimal totalPriceAfterDeleteCartItem =
                cart.getTotalPrice().subtract(
                        cartItem.getProduct().getProductPrice()
                                .multiply(BigDecimal.valueOf(cartItem.getQuantity()))
                );

        cart.setTotalQuantity(totalQuantityAfterDeleteCartItem);
        cart.setTotalPrice(totalPriceAfterDeleteCartItem);

        cartItemRepository.delete(cartItem);

        cartRepository.save(cart);
    }
}