import { NullableBaseDB } from '@/helpers/generic';
import User from '@/helpers/interfaces/user';

export interface BusinessRequest extends NullableBaseDB {
  ownerId: string;
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

export enum AdPosition {
  USER_DASHBOARD,
  HOME_PAGE,
}

export interface BusinessAd {
  to: string;
  owner: string;
  bid: string;
  description: string;
  title: string;
  reviewed: boolean;
  imageSource: string;
  positions: AdPosition;
}

export interface VerifyPaymentAccount {
  price: number;
  business: Business;
  author: User;
  username: string;
  verified: boolean;
  reason?: string;
}
