export enum UserPermissions {
  // USER stuff
  ACCESS_FORM,
  CREATE_RESPONSE,

  // ADMIN stuff
  MANAGE_USERS,
  VIEW_FORM_RESPONSES,
  MANAGE_FORM_RESPONSES,
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
