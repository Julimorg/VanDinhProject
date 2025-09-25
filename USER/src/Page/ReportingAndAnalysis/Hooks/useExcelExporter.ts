import { docApi } from "@/Api/docApi";
import type { StatisticRequestExportExelFile } from "@/Interface/TRevenue";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";


type ExportExelFileOptions = Omit<UseMutationOptions<Blob, AxiosError<{ message?: string }>, StatisticRequestExportExelFile>, "mutationFn" | "mutationKey">;


export const useExportExcel = (options?: ExportExelFileOptions) => {
    return useMutation<Blob, AxiosError<{ message?: string }>, StatisticRequestExportExelFile>({
        mutationKey: ["exportExcel"],
        mutationFn: (body: StatisticRequestExportExelFile) => docApi.ExportRevenueExcelFile(body),
        ...options,
    })
}