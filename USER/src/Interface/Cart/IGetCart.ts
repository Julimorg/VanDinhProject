import type { ProductForCartItem } from "./IAddProductToCart";

export type IGetCartResponse = {
    cartId: string;
    userId: string;
    totalPrice: number;
    totalQuantity: number;
    items: CartItemDetailResponse[];
    createdAt: string;
    updatedAt: string;
}

export type CartItemDetailResponse = {
    cartItemId: string;
    cartId: string;
    product: ProductForCartItem;
    createAt: string;
    updateAt: string;
}
