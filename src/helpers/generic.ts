export function debounce (func: () => void, time: number): (e: unknown) => void {
  const actualTime = time || 100;
  let timer: number | null;

  return (e) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(func, actualTime, e);
  };
}

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

export interface Ad {
  show: boolean;
  business: number;
  title: string;
  description: string;
  imageSource: string;
  to: string;
}
