export enum UserPermissions {
  // USER stuff
  ACCESS_TUV_FORM,
  ACCESS_DRIVERS_LICENSE_FORM,
  ACCESS_BUSINESS_FORM,
  ACCESS_BUSINESS,

  // INSPECTOR, INSTRUCTOR stuff
  MANAGE_TUV_RESPONSES,
  MANAGE_DRIVERS_LICENSE_RESPONSES,
  MANAGE_BUSINESS_RESPONSES,

  // ADMIN stuff
  MANAGE_USERS,
  MANAGE_FORMS,
}

export enum UserRoles {
  USER,
  TUVINSPECTOR,
  MODERATOR,
  ADMIN,
  DEVELOPER,
}

export default interface User {
  id: number;
  createdAt: string;
  updatedAt: string;
  discordId: string;

  username: string,
  email: string,
  avatarURI: string,
  discriminator: string,
  verified: boolean,
  mfaEnabled: boolean,
  locale: string,
  permissions: UserPermissions[],
}
