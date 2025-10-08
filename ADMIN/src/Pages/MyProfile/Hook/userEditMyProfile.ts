import { docApi } from "@/Api/docApi";
import { IUdpateMyProfileRequest, IUpdateMyProfileResponse } from "@/Interface/Users/IUpdateMyProfile";
import {  useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

type UseEditProfileOption = Omit<
  UseMutationOptions<unknown, AxiosError<{ message?: string }>, IUdpateMyProfileRequest, IUpdateMyProfileResponse>,
  "mutationFn"
>;


export const useUpdateMyProfile = (userId: string, options?: UseEditProfileOption) => {
    return useMutation<unknown, AxiosError<{ message?: string }>, IUdpateMyProfileRequest, IUpdateMyProfileResponse>({
        mutationFn: (body: IUdpateMyProfileRequest) => docApi.UpdateMyProfile(body, userId),
        ...options,
    })
}