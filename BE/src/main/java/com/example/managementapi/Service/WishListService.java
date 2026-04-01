package com.example.managementapi.Service;

import com.example.managementapi.Dto.Response.WishList.AddWishListRes;
import com.example.managementapi.Dto.Response.WishList.GetWishList;
import com.example.managementapi.Entity.Product;
import com.example.managementapi.Entity.User;
import com.example.managementapi.Entity.WishList;
import com.example.managementapi.Mapper.WishListMapper;
import com.example.managementapi.Repository.ProductRepository;
import com.example.managementapi.Repository.UserRepository;
import com.example.managementapi.Repository.WishListRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class WishListService {

    private final WishListRepository wishListRepo;

    private final UserRepository userRepo;

    private final ProductRepository productRepo;

    private final WishListMapper wishListMapper;

    public AddWishListRes addProductToWishList(String userId, String productId){
            if (wishListRepo.existsByUserIdAndProductProductId(userId, productId)){
                throw new RuntimeException("Sản phẩm đã có trong wish list !");
            }

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        WishList wishlist = WishList.builder()
                .user(user)
                .product(product)
                .build();

        WishList save = wishListRepo.save(wishlist);

        return wishListMapper.toAddWishListRes(wishlist);
    }

    @Transactional
    public void removeFromWishlist(String userId, String productId) {
        if (!wishListRepo.existsByUserIdAndProductProductId(userId, productId)) {
            throw new RuntimeException("Sản phẩm không có trong wishlist");
        }
        wishListRepo.deleteByUserIdAndProductProductId(userId, productId);
    }

    @Transactional
    public String toggleWishlist(String userId, String productId) {
        if (wishListRepo.existsByUserIdAndProductProductId(userId, productId)) {
            wishListRepo.deleteByUserIdAndProductProductId(userId, productId);
            return "Đã xóa khỏi wishlist";
        } else {
            addProductToWishList(userId, productId);
            return "Đã thêm vào wishlist";
        }
    }

    public Page<GetWishList> getWishListUser(String userId, Pageable pageable){

        if (!userRepo.existsById(userId)) {
            throw new RuntimeException("Không tìm thấy user");
        }

        return wishListRepo
                .findByUserId(userId, pageable)
                .map(wishList -> wishListMapper
                        .toWishlistResponse(wishList));
    }

    public boolean isInWishlist(String userId, String productId) {
        return wishListRepo.existsByUserIdAndProductProductId(userId, productId);
    }

    // TODO
    // MAKING A TRACKING FAVOR PRODUCT FOR USER
}
