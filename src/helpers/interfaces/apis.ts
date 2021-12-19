export interface BeamMPServer {
  players: string;
  playerslist: string;
  maxplayers: string;
  ip: string;
  location: string;
  port: string;
  dport: string;
  map: string;
  private: boolean;
  sname: string;
  version: string;
  cversion: string;
  official: boolean;
  owner: string;
  sdesc: string;
  pps: string;
  modlist: string;
  modstotal: string;
  modstotalsize: string;
}

export interface Wallet {
  bank: number;
  cash: number;
  total: number;
}
