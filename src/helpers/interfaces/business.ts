import { NullableBaseDB } from '@/helpers/generic';

export interface BusinessRequest extends NullableBaseDB {
  owner: string;
  members: string[];
  name: string;
  abbreviation: string;
}

export interface Business extends NullableBaseDB {
  /* UUID4 ID */
  bid: string;
  name: string;
  abbreviation: string;
  owner: string;
  members: string[];
}
