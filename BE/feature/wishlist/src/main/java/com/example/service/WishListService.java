package com.example.service;
import com.example.common.dto.wishlist.response.AddWishListRes;
import com.example.common.dto.wishlist.response.GetWishList;
import com.example.common.enums.ErrorCode;
import com.example.common.exception.AppException;
import com.example.common.interfaces.products.ProductQueryInternalService;
import com.example.common.interfaces.user.UserInternalService;
import com.example.mapper.WishListMapper;
import com.example.persistence.entity.Product;
import com.example.persistence.entity.User;
import com.example.persistence.entity.WishList;
import com.example.repository.WishListRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class WishListService {

    private final WishListRepository wishListRepository;

    private final WishListMapper wishListMapper;

    private final UserInternalService userInternalService;

    private final ProductQueryInternalService productInternalService;

    public boolean isInWishlist(String userId, String productId) {
        return wishListRepository.existsByUserIdAndProductProductId(userId, productId);
    }

    public AddWishListRes addProductToWishList(String userId, String productId) {

        if ( wishListRepository.existsByUserIdAndProductProductId(userId, productId) ) {
            throw new AppException(ErrorCode.PRODUCT_EXISTED_IN_WISHLIST);
        }

        User user = userInternalService.getUserById(userId);

        Product product = productInternalService.getProductById(productId);

        WishList wishList = WishList.builder()
                .user(user)
                .product(product)
                .createAt(LocalDateTime.now())
                .build();

        WishList save = wishListRepository.save(wishList);

        return wishListMapper.toAddWishListRes(wishList);
    }

    @Transactional
    public void removeFromWishlist(String userId, String productId) {
        if (!wishListRepository.existsByUserIdAndProductProductId(userId, productId)) {
            throw new AppException(ErrorCode.PRODUCT_NONE_EXISTED_IN_WISHLIST);
        }
        wishListRepository.deleteByUserIdAndProductProductId(userId, productId);
    }


    @Transactional
    public String toggleWishlist(String userId, String productId) {
        if (wishListRepository.existsByUserIdAndProductProductId(userId, productId)) {
            wishListRepository.deleteByUserIdAndProductProductId(userId, productId);
            return "Đã xóa khỏi wishlist";
        } else {
            addProductToWishList(userId, productId);
            return "Đã thêm vào wishlist";
        }
    }


    public Page<GetWishList> getWishListUser(String userId, Pageable pageable){

         userInternalService.validateUserExists(userId);


        return wishListRepository
                .findByUserId(userId, pageable)
                .map(wishList -> wishListMapper
                        .toWishlistResponse(wishList));
    }

    // TODO
    // MAKING A TRACKING FAVOR PRODUCT FOR USER
}
