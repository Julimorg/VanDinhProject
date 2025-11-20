import { useQuery } from "@tanstack/react-query";
import type { District, Province, Ward } from "../Interface/IShipAddress/IShipAddress";
import { VIETNAM_API_ADDRESS } from "../Utils/env_dev_handler";
import { QueryKeys } from "../Constant/query-key";

export const useVietnamAddress = () => {
    //? 1. Tỉnh/Thành phố 
  const provincesQuery = useQuery<Province[], Error>({
    queryKey: [QueryKeys.GET_VIETNAM_PROVINCES],
    queryFn: async () => {
      const res = await fetch(VIETNAM_API_ADDRESS);
      if (!res.ok) throw new Error('Lỗi tải tỉnh/thành phố');
      return res.json();
    },
    staleTime: Infinity,
  });

  //? 2. Quận/Huyện theo tỉnh
  const useDistricts = (provinceCode?: number) => {
    return useQuery<District[], Error>({
      queryKey: [QueryKeys.GET_VIETNAM_DISTRICT, provinceCode],
      queryFn: async () => {
        const res = await fetch(`${VIETNAM_API_ADDRESS}/p/${provinceCode}?depth=2`);
        if (!res.ok) throw new Error('Lỗi tải quận/huyện');
        const data = await res.json();
        return data.districts as District[];
      },
      enabled: !!provinceCode,
      staleTime: Infinity,
    });
  };

  //? 3. Phường/Xã theo quận
  const useWards = (districtCode?: number) => {
    return useQuery<Ward[], Error>({
      queryKey: [QueryKeys.GET_VIETNAM_WARDS, districtCode],
      queryFn: async () => {
        const res = await fetch(`${VIETNAM_API_ADDRESS}/d/${districtCode}?depth=2`);
        if (!res.ok) throw new Error('Lỗi tải phường/xã');
        const data = await res.json();
        return data.wards as Ward[];
      },
      enabled: !!districtCode,
      staleTime: Infinity,
    });
  };

  return {
    provinces: provincesQuery.data ?? [],
    isLoadingProvinces: provincesQuery.isLoading,

    useDistricts,
    useWards,
  };
};