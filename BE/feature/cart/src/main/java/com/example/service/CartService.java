package com.example.service;

import com.example.common.dto.cart.request.AddItemToCartReq;
import com.example.common.dto.cart.request.UpdateCartItemQuantityReq;
import com.example.common.dto.cart.response.CartItemDetailRes;
import com.example.common.dto.cart.response.GetCartRes;
import com.example.common.enums.ErrorCode;
import com.example.common.exception.AppException;
import com.example.common.interfaces.products.ProductQueryInternalService;
import com.example.common.interfaces.user.UserInternalService;
import com.example.mapper.CartMapper;
import com.example.persistence.entity.Cart;
import com.example.persistence.entity.CartItem;
import com.example.persistence.entity.Product;
import com.example.persistence.entity.User;
import com.example.repository.CartItemRepository;
import com.example.repository.CartRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_STAFF', 'ROLE_ADMIN')")
public class CartService {

    private final CartRepository cartRepository;

    private final CartItemRepository cartItemRepository;

    private final CartMapper cartMapper;

    private final UserInternalService userInternalService;

    private final ProductQueryInternalService productInternalService;

    @Transactional
    public GetCartRes getCart(String userId) {
        Cart cart = findOrCreateCart(userId);
        return cartMapper.toGetCartRes(cart);
    }

    private void validateQuantity(int quantity, Product product) {
        if (quantity < 0 || quantity > product.getProductQuantity()) {
            throw new RuntimeException(
                    "Invalid quantity for product: " + product.getProductName()
                            + " (available: " + product.getProductQuantity() + ")"
            );
        }
    }

    private void reCalculateCart(Cart cart) {
        cart.setTotalQuantity(
                cart.getCartItems()
                        .stream()
                        .mapToInt(CartItem::getQuantity)
                        .sum()
        );
        cart.setTotalPrice(
                cart.getCartItems().stream()
                        .map(item -> item.getProduct().getProductPrice()
                                .multiply(BigDecimal.valueOf(item.getQuantity())))
                        .reduce(BigDecimal.ZERO, BigDecimal::add)
        );
        cart.setUpdateAt(LocalDateTime.now());
    }

    private Cart findOrCreateCart(String userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {

            User user = userInternalService.getUserById(userId);

            Cart newCart = Cart.builder()
                    .user(user)
                    .totalQuantity(0)
                    .totalPrice(BigDecimal.ZERO)
                    .cartItems(new ArrayList<>())
                    .createAt(LocalDateTime.now())
                    .updateAt(LocalDateTime.now())
                    .build();
            user.setCart(newCart);
            log.info("Created new cart for userId={}", userId);
            return cartRepository.save(newCart);
        });
    }


    @Transactional
    public GetCartRes addProductToCart(String userId,
                                       AddItemToCartReq request) {

        Cart cart = findOrCreateCart(userId);

        Product product = productInternalService
                .getProductById(request.getProductId());

        validateQuantity(request.getQuantity(), product);

        Optional<CartItem> existingItem = cart
                .getCartItems()
                .stream()
                .filter(ci -> ci.getProduct()
                        .getProductId()
                        .equals(request.getProductId()))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem cartItem = existingItem.get();

            validateQuantity(cartItem.getQuantity() + request.getQuantity(), product);
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
            cartItem.setUpdateAt(LocalDateTime.now());
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .createAt(LocalDateTime.now())
                    .updateAt(LocalDateTime.now())
                    .build();
            cart.getCartItems().add(newItem);
        }

        reCalculateCart(cart);

        return cartMapper
                .toGetCartRes(cartRepository.save(cart));
    }

    @Transactional
    public CartItemDetailRes updateCartItem(String cartItemId,
                                            UpdateCartItemQuantityReq request) {

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("CartItem not found"));

        validateQuantity(request.getQuantity(), cartItem.getProduct());

        cartItem.setQuantity(request.getQuantity());
        cartItem.setUpdateAt(LocalDateTime.now());

        reCalculateCart(cartItem.getCart());
        cartRepository.save(cartItem.getCart());

        return cartMapper.toCartItemDetailRes(cartItem);
    }

    @Transactional
    public void deleteCartItem(String cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));

        Cart cart = cartItem.getCart();
        cart.getCartItems().remove(cartItem);
        cartItemRepository.delete(cartItem);

        reCalculateCart(cart);
        cartRepository.save(cart);
    }






}
