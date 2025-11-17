export type IAddProductToCartRequest = {
    productId: string;
    quantity: number;
};

export type IAddProductToCartResponse = {
    cartId: string;
    userId: string;
    totalPrice: number;
    totalQuantity: number;
    createdAt: string;
    updatedAt: string;
    items: CartItemDetail[];
    createAt: string;
    updateAt: string;
};

export interface CartItemDetail {
    cartItemId: string;
    cartId: string;
    product: ProductForCartItem;
    createAt: string;
    updateAt: string;
}

export interface ProductForCartItem {
    productId: string;
    productName: string;
    productImage: string[];
    productVolume: string;
    productUnit: string;
    productCode: string;
    productQuantity: number;
    discount: number;
    productPrice: number;
    colorName: string;
    categoryName: string;
}