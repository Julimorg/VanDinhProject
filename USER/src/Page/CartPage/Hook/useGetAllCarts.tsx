import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { IApiResponse } from "../../../Interface/IApiResponse";
import { cart_api } from "../../../Api/cart_api";
import type { IGetCartResponse } from "../../../Interface/Cart/IGetCart";



type UseGetAllCartsOptions = Omit<
  UseQueryOptions<IApiResponse<IGetCartResponse>, unknown>,
  "queryKey" | "queryFn"
>;

export const useGetAllCarts = (userId: string, options?: UseGetAllCartsOptions) => {
  return useQuery({
    queryKey: ["Get All Products", userId], 
    queryFn: () => cart_api.GetAllCarts(userId),
    enabled: !!userId,
    ...options,
  });
};