import { docApi } from "@/Api/docApi";
import type { DevRegisterRequest, DevRegisterResposne } from "@/Interface/TDevRegister";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type useCreateUserOption = Omit<UseMutationOptions<DevRegisterResposne, AxiosError<{ message?: string }>, DevRegisterRequest>,
 'mutationFn'>
;

export const useCreateUser =  (option?: useCreateUserOption) => {
    return useMutation<DevRegisterResposne, AxiosError<{ message?: string }>, DevRegisterRequest>({
        ...option,
        mutationFn: docApi.CreateUser,
    })
}