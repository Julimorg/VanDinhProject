
import type { TResponse } from "@/Interface/TPage";
import axiosClient from "./AxiosClientBroker";
import type { TCreateGate, TDetailGate, TGate, TGateConfig, TUpdateGate } from "@/Interface/TGate";


export const gateApi = {
  getAllGate: async (org_name: string): Promise<TResponse<TGate[]>> => {
    const encodedOrgName = encodeURIComponent(org_name);
    const url = `/api/gate/get-all?org_name=${encodedOrgName}`;
    const res = await axiosClient.get(url);
    return res.data;
    
  },
  acceptNewGate: async (): Promise<TResponse<boolean>> => {
    const url = `/api/gate/accept_new_connection`;
    const res = await axiosClient.get(url);
    return res.data;
  },
  UpdateAcceptNewGate: async (
    isEnable: boolean
  ): Promise<TResponse<TGate[]>> => {
    const url = `/api/gate/accept_new_connection?isEnable=${isEnable}`;
    const res = await axiosClient.post(url);
    return res.data;
  },

  getGateById: async (gateId: string): Promise<TResponse<TDetailGate>> => {
    const url = `/api/gate/${gateId}`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  createGate: async (data: TCreateGate) => {
    const url = `/api/gate`;
    const res = await axiosClient.post(url, data);
    return res.data;
  },
  updateGate: async (gateId: string, data: TUpdateGate) => {
    const url = `/api/gate/${gateId}`;
    const res = await axiosClient.post(url, data);
    return res.data;
  },
  deleteGate: async (gateId: string) => {
    const url = `/api/gate/${gateId}`;
    const res = await axiosClient.delete(url);
    return res.data;
  },

  getConfigGate: async (
    serialNo: string
  ): Promise<TResponse<TGateConfig[]>> => {
    const url = `/api/gate/${serialNo}/config`;
    const res = await axiosClient.get(url);
    return res.data;
  },
  updateConfigGate: async (idGate: string, data: TGateConfig[]) => {
    const url = `/api/gate/${idGate}/config`;
    const res = await axiosClient.patch(url, data);
    return res.data;
  },
};
