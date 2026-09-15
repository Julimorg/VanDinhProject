import { IApiResponse } from "@/Interface/IApiResponse";
import axiosClient from "./axiosClient";


// export const colorApi = {
//     GetColorsBySupplier: async (supplierId: string): Promise<IApiResponse<ColorItem[]>> => {
//         const url = `/color/`;
//         const res = await axiosClient.get(url, {
//             params: { supplierId, size: 1000 },
//         });
//         return res.data;
//     }
// }