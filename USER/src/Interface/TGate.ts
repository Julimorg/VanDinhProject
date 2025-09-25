export type TGate = {
  serialNo: string;
  name: string;
  userName: string;
  password: string;
  state: number;
  createdAt: string;
  modifierOn: string;
  id: string;
  isOpen?: boolean;
};

export type TCreateGate = Pick<
  TGate,
  "serialNo" | "name" | "userName" | "password" | "state"
>;

export type TUpdateGate = Pick<TGate, "name" | "userName" | "password">;

export const  GateConfigKey = {
  API_KEY : "API_KEY",
  USER_ACCESS : "USER_ACCESS",
  API_URL: "API_URL",
  MY_HOSTNAME : "MY_HOSTNAME",
  MY_IP : "MY_IP",
  PASS_ACCESS :  "PASS_ACCESS",
  FIRMWARE_VERSION : "FIRMWARE_VERSION",
  S3_URL : "S3_URL",
}

export type TGateConfig = {
  key: keyof typeof GateConfigKey;
  value: string;
  defaultValue: string;
  modifierOn: string;
  id: string;
}

export type TDetailGate = TGate & {
  configs: TGateConfig[];
};
