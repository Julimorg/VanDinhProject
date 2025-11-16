import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import type { IApiResponse } from "../../../Interface/IApiResponse";
import { user_api } from "../../../Api/user_api";
import type { IUdpateMyProfileRequest, IUpdateMyProfileResponse } from "../../../Interface/Users/IUpdateMyProfile";


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