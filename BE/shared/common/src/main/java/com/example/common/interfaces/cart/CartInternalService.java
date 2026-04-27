package com.example.common.interfaces.cart;

import com.example.persistence.entity.Cart;
import com.example.persistence.entity.Category;

public interface CartInternalService {

    void validateCartExists(String cartId);

    void saveCartData(Cart cart);

    Cart getCart(String cartId);
}
