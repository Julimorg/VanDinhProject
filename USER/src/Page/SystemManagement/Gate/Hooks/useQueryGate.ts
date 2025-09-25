
import { gateApi } from "@/Api/gateApi";
import { QueryKeys } from "@/Constant/query-key";
import type { TCreateGate, TGate, TGateConfig, TUpdateGate } from "@/Interface/TGate";
import { useMutation, useQuery, useQueryClient, type UseMutationOptions, type UseQueryOptions } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useQueryGate = () => {
  const queryClient = useQueryClient();
  const getAllGate = useQuery({
    queryKey: [QueryKeys.GATE],
    queryFn: () => gateApi.getAllGate("C&T Company"),
    staleTime: 1 * 60 * 1000, // 10 minuets
    retry: 1,
    placeholderData: (previousData) => previousData,
  });

  const acceptNewGate = useQuery({
    queryKey: [QueryKeys.ACCEPT_NEW_GATE],
    queryFn: () => gateApi.acceptNewGate(),
    staleTime: 1 * 60 * 1000, // 10 minuets
    retry: 1,
    placeholderData: (previousData) => previousData,
  });

  const UpdateAcceptNewGate = useMutation({
    mutationFn: (isEnable: boolean) => gateApi.UpdateAcceptNewGate(isEnable),
    onSuccess: () => {
      toast.success("Thành công");
      queryClient.invalidateQueries({ queryKey: [QueryKeys.ACCEPT_NEW_GATE] });
    },
  });
  const createGate = useMutation({
    mutationFn: (data: TCreateGate) => gateApi.createGate(data),
    onSuccess: () => {
      toast.success("Tạo cổng thành công");
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GATE] });
    },
  });

  const updateGate = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TUpdateGate }) =>
      gateApi.updateGate(id, data),
    onSuccess: () => {
      toast.success("Cập nhật cổng thành công");
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GATE] });
    },
  });

  const deleteGate = useMutation({
    mutationFn: (id: string) => gateApi.deleteGate(id),
    onSuccess: () => {
      toast.success("Xóa cổng thành công");
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GATE] });
    },
  });

  return {
    getAllGate,
    createGate,
    updateGate,
    deleteGate,
    acceptNewGate,
    UpdateAcceptNewGate,
  };
};

export const useConfigGateById = (gateId: string) => {
  const queryClient = useQueryClient();
  const getGateById = useQuery({
    queryKey: [QueryKeys.GATE_BY_ID, gateId],
    queryFn: () => gateApi.getGateById(gateId),
    staleTime: 1 * 60 * 1000, // 10 minuets
    retry: 1,
    placeholderData: (previousData) => previousData,
  });

  const updateConfigGate = useMutation({
    mutationFn: (data: TGateConfig[]) => gateApi.updateConfigGate(gateId, data),
    onSuccess: () => {
      toast.success("Cấu hình cổng thành công");
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GATE_BY_ID, gateId],
      });
    },
  });

  return {
    getGateById,
    updateConfigGate,
  };
};

export type useGetGateQueryOptions = Omit<
  UseQueryOptions<TGate>,
  "queryKey" | "queryFn"
>;

export type useCreateGateMutationOptions = Omit<
  UseMutationOptions<TGate, Error, TCreateGate>,
  "mutationFn"
>;

export type useUpdateGateMutationOptions = Omit<
  UseMutationOptions<TGate, Error, TUpdateGate>,
  "mutationFn"
>;

export type useDeleteGateMutationOptions = Omit<
  UseMutationOptions<TGate, Error, string>,
  "mutationFn"
>;
