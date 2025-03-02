export type AssetType = {
  type: string;
  count: number;
};

export type Protocol = {
  name: string;
  count: number;
};

export type Subnet = {
  network: string;
  mask: string;
  count: number;
};

export type ScadaInfo = {
  protocol: string;
  version: string;
  count: number;
};

export type OuiInfo = {
  vendor: string;
  count: number;
};

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}
