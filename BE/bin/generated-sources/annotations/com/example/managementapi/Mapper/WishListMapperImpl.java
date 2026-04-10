package com.example.managementapi.Mapper;

import com.example.managementapi.Dto.Response.WishList.AddWishListRes;
import com.example.managementapi.Dto.Response.WishList.GetWishList;
import com.example.managementapi.Entity.Product;
import com.example.managementapi.Entity.WishList;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-10T10:06:49+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class WishListMapperImpl implements WishListMapper {

    @Override
    public GetWishList toWishlistResponse(WishList wishlist) {
        if ( wishlist == null ) {
            return null;
        }

        GetWishList.GetWishListBuilder getWishList = GetWishList.builder();

        getWishList.wishListId( wishlist.getWishListId() );
        getWishList.productId( wishlistProductProductId( wishlist ) );
        getWishList.productName( wishlistProductProductName( wishlist ) );
        getWishList.productDescription( wishlistProductProductDescription( wishlist ) );
        getWishList.productPrice( wishlistProductProductPrice( wishlist ) );
        getWishList.discount( wishlistProductDiscount( wishlist ) );
        List<String> productImage = wishlistProductProductImage( wishlist );
        List<String> list = productImage;
        if ( list != null ) {
            getWishList.productImage( new ArrayList<String>( list ) );
        }
        getWishList.productVolume( wishlistProductProductVolume( wishlist ) );
        getWishList.productUnit( wishlistProductProductUnit( wishlist ) );
        getWishList.productQuantity( wishlistProductProductQuantity( wishlist ) );
        getWishList.createAt( wishlist.getCreateAt() );

        return getWishList.build();
    }

    @Override
    public AddWishListRes toAddWishListRes(WishList wishList) {
        if ( wishList == null ) {
            return null;
        }

        AddWishListRes.AddWishListResBuilder addWishListRes = AddWishListRes.builder();

        addWishListRes.wishListId( wishList.getWishListId() );
        addWishListRes.productId( wishlistProductProductId( wishList ) );
        addWishListRes.productName( wishlistProductProductName( wishList ) );
        addWishListRes.productDescription( wishlistProductProductDescription( wishList ) );
        addWishListRes.productPrice( wishlistProductProductPrice( wishList ) );
        addWishListRes.discount( wishlistProductDiscount( wishList ) );
        List<String> productImage = wishlistProductProductImage( wishList );
        List<String> list = productImage;
        if ( list != null ) {
            addWishListRes.productImage( new ArrayList<String>( list ) );
        }
        addWishListRes.productVolume( wishlistProductProductVolume( wishList ) );
        addWishListRes.productUnit( wishlistProductProductUnit( wishList ) );
        addWishListRes.productQuantity( wishlistProductProductQuantity( wishList ) );
        addWishListRes.createAt( wishList.getCreateAt() );

        return addWishListRes.build();
    }

    private String wishlistProductProductId(WishList wishList) {
        if ( wishList == null ) {
            return null;
        }
        Product product = wishList.getProduct();
        if ( product == null ) {
            return null;
        }
        String productId = product.getProductId();
        if ( productId == null ) {
            return null;
        }
        return productId;
    }

    private String wishlistProductProductName(WishList wishList) {
        if ( wishList == null ) {
            return null;
        }
        Product product = wishList.getProduct();
        if ( product == null ) {
            return null;
        }
        String productName = product.getProductName();
        if ( productName == null ) {
            return null;
        }
        return productName;
    }

    private String wishlistProductProductDescription(WishList wishList) {
        if ( wishList == null ) {
            return null;
        }
        Product product = wishList.getProduct();
        if ( product == null ) {
            return null;
        }
        String productDescription = product.getProductDescription();
        if ( productDescription == null ) {
            return null;
        }
        return productDescription;
    }

    private BigDecimal wishlistProductProductPrice(WishList wishList) {
        if ( wishList == null ) {
            return null;
        }
        Product product = wishList.getProduct();
        if ( product == null ) {
            return null;
        }
        BigDecimal productPrice = product.getProductPrice();
        if ( productPrice == null ) {
            return null;
        }
        return productPrice;
    }

    private double wishlistProductDiscount(WishList wishList) {
        if ( wishList == null ) {
            return 0.0d;
        }
        Product product = wishList.getProduct();
        if ( product == null ) {
            return 0.0d;
        }
        double discount = product.getDiscount();
        return discount;
    }

    private List<String> wishlistProductProductImage(WishList wishList) {
        if ( wishList == null ) {
            return null;
        }
        Product product = wishList.getProduct();
        if ( product == null ) {
            return null;
        }
        List<String> productImage = product.getProductImage();
        if ( productImage == null ) {
            return null;
        }
        return productImage;
    }

    private String wishlistProductProductVolume(WishList wishList) {
        if ( wishList == null ) {
            return null;
        }
        Product product = wishList.getProduct();
        if ( product == null ) {
            return null;
        }
        String productVolume = product.getProductVolume();
        if ( productVolume == null ) {
            return null;
        }
        return productVolume;
    }

    private String wishlistProductProductUnit(WishList wishList) {
        if ( wishList == null ) {
            return null;
        }
        Product product = wishList.getProduct();
        if ( product == null ) {
            return null;
        }
        String productUnit = product.getProductUnit();
        if ( productUnit == null ) {
            return null;
        }
        return productUnit;
    }

    private int wishlistProductProductQuantity(WishList wishList) {
        if ( wishList == null ) {
            return 0;
        }
        Product product = wishList.getProduct();
        if ( product == null ) {
            return 0;
        }
        int productQuantity = product.getProductQuantity();
        return productQuantity;
    }
}
