import { docApi } from "@/Api/docApi";
import type { ReceipterRequestExportExeilFile } from "@/Interface/TRevenue";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";


type ExportExelReceipterStatisticFileOptions = Omit<UseMutationOptions<Blob, AxiosError<{ message?: string }>, ReceipterRequestExportExeilFile>, "mutationFn" | "mutationKey">;


export const useExportReceipterExcel = (options?: ExportExelReceipterStatisticFileOptions) => {
    return useMutation<Blob, AxiosError<{ message?: string }>, ReceipterRequestExportExeilFile>({
        mutationKey: ["exportReceipterExcel"],
        mutationFn: (body: ReceipterRequestExportExeilFile) => docApi.ExportReceipterStatisticExcelFile(body),
        ...options,
    })
}