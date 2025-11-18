import type { IAddProductToCartRequest, IAddProductToCartResponse } from "../Interface/Cart/IAddProductToCart";
import type { IGetCartResponse } from "../Interface/Cart/IGetCart";
import type { IApiResponse } from "../Interface/IApiResponse";
import axiosClient from "./axiosClient";

export const cart_api = {
    AddProductToCart: async (userId: string, body: IAddProductToCartRequest): Promise<IApiResponse<IAddProductToCartResponse>> => {
        const url = `/cart/add-items/${userId}`;
        const res = await axiosClient.post(url, body, {
            headers: { 'Content-Type': 'application/json' },
        });
        return res.data;
    },

    GetAllCarts: async(userId: string): Promise<IApiResponse<IGetCartResponse>> => {
        const url = `/cart/get-cart/${userId}`;
        const res = await axiosClient.get(url);
        return res.data;
    },

    UpdateCartItemQuantity: async(cartItemId: string, quantity: number): Promise<IApiResponse<IGetCartResponse>> => {
        const url = `/cart/update-item/${cartItemId}`;
        const res = await axiosClient.patch(url, {quantity} , {
            headers: { 'Content-Type': 'application/json' },
        });
        return res.data;
    },

    DeleteCartItem: async(cartItemId: string): Promise<IApiResponse<void>> => {
        const url = `/cart/delete-item/${cartItemId}`;
        const res = await axiosClient.delete(url);
        return res.data;
    }

}