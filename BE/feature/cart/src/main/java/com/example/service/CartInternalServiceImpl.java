package com.example.service;

import com.example.common.enums.ErrorCode;
import com.example.common.exception.AppException;
import com.example.common.interfaces.cart.CartInternalService;
import com.example.mapper.CartMapper;
import com.example.persistence.entity.Cart;
import com.example.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartInternalServiceImpl implements CartInternalService {

    private final CartRepository cartRepository;

    private final CartMapper cartMapper;

    @Override
    public void validateCartExists(String cartId) {
        if (!cartRepository.existsById(cartId)) {
            throw new AppException(ErrorCode.CART_NOT_EXISTED);
        }
    }

    @Override
    public void saveCartData(Cart cart) {
        cartRepository.save(cart);
    }

    @Override
    public Cart getCart(String cartId) {

        validateCartExists(cartId);

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));

        return cartMapper.toGetCartByIdWithInterface(cart);
    }
}
