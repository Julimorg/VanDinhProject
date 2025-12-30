import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import type { IApiResponse } from "../../../Interface/IApiResponse";
import type { IUdpateMyProfileRequest, IUpdateMyProfileResponse } from "../../../Interface/Users/IUpdateMyProfile";
import { user_api } from "../../../Api/Api_Handler/user_api";


type UseUpdateUserOptions = Omit<
  UseMutationOptions<
    IApiResponse<IUpdateMyProfileResponse>,
    Error,
    IUdpateMyProfileRequest
  >,
  "mutationFn"
>;

export const useUpdateMyProfile = (userId: string, options?: UseUpdateUserOptions) => {
  return useMutation({
    mutationFn: (body: IUdpateMyProfileRequest) => user_api.UpdateMyProfile(body, userId),
    ...options,
  });
};