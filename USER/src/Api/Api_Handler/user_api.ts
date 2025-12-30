import type { IApiResponse } from "../../Interface/IApiResponse";
import type { IGetMyProfileResponse } from "../../Interface/Users/IGetMyProfile";
import type { IUdpateMyProfileRequest, IUpdateMyProfileResponse } from "../../Interface/Users/IUpdateMyProfile";
import { buildFormData } from "../../Utils/utils";
import axiosClient from "../Axios/axiosClient";


export const user_api = {
    
    GetMyProfile: async (userId: string): Promise<IApiResponse<IGetMyProfileResponse>> => {
        const url = `/users/view-profile/${userId}`;
        const res = await axiosClient.get(url);
        return res.data;
      },
    
    UpdateMyProfile: async (
      body: IUdpateMyProfileRequest,
      userId: string
    ): Promise<IApiResponse<IUpdateMyProfileResponse>> => {
      const url = `/users/update-profile/${userId}`;
      const formData = buildFormData(body);

      // for (const pair of formData.entries()) {
      //   console.log(pair[0] + ': ' + pair[1]);
      // }

      const res = await axiosClient.patch(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data; charset=utf-8',
        },
      });

      console.log('API Response:', res.data);
      return res.data;
    },
  
}