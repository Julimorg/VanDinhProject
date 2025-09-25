import type { TProduct } from "@/Interface/TProduct";
import axiosClient from "./axiosClient";

export const productApi = {
  getAll: async (): Promise<TProduct[]> => {
    const url = `/product/all`;
    const res = await axiosClient.get(url);
    return res.data;
  },
};
