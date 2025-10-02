import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { QueryKeys } from "@/Constant/query-key";
import type { Language, LanguageResponse } from "@/Interface/TLanguage";
import { docApi } from "@/Api/docApi";

type UseLanguageOptions = Omit<
  UseQueryOptions<LanguageResponse, unknown>,
  "queryKey" | "queryFn"
>;

export const useLanguage = (options?: UseLanguageOptions) => {
  return useQuery({
    ...options,
    queryKey: [QueryKeys.LANGUAGE],
    queryFn: docApi.getLanguage,
  });
};
