export function hasOwn (thisArg: unknown, prop: string): boolean {
  return Object.prototype.hasOwnProperty.call(thisArg, prop);
}

export interface TuvFormData {
  id: number;
  createdAt: string;
  updatedAt: string;

  checked: boolean | null;
  inspector: string | null;
  approved: boolean | null;
  declineReason: string | null;

  owner: string;
  discordName: string;
  licensePlate: string;
  firstRegistry: string | null;
  vehicleBrand: string;
  vehicleModel: string;
  engineType: string;
  engineHorsepower: number;
  engineCCM: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  vehicleColor: string;
  vehicleWeight: number;
  vehicleSeatsAmount: number;
  vehicleYear: string;
  additionalInfos: string | null;
  tid: string;
}
