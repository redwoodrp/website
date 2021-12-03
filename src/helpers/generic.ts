export function hasOwn (thisArg: unknown, prop: string): boolean {
  return Object.prototype.hasOwnProperty.call(thisArg, prop);
}

export interface TuvFormData {
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
}
