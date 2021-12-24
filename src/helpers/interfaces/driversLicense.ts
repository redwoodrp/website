import { NullableBaseDB } from '@/helpers/generic';

export type DriversLicenseClass = 'A' | 'A1' | 'B' | 'C' | 'C1' | 'D';

export default interface DriversLicense extends NullableBaseDB{
  owner: string;
  discordName: string;

  classes: DriversLicenseClass[];
  instructor: string;
  issued: string;
}

export interface DriversLicenseRequest extends NullableBaseDB {
  owner: string;
  discordName: string;

  class: DriversLicenseClass;
  hasTime: string;
  additionalNotes: string;
  signature: string;
}
