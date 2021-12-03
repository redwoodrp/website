import io from 'socket.io-client';
import socketio from '@feathersjs/socketio-client';
import feathers from '@feathersjs/feathers';
import auth from '@feathersjs/authentication-client';
import config from '../../config';

const socket = io(config.backend, { transports: ['websocket'] });

const feathersClient = feathers();

feathersClient.configure(socketio(socket, { timeout: 30000 }));
feathersClient.configure(auth());

export interface User {
  id: number;
  createdAt: string;
  updatedAt: string;

  username: string;
  email: string;
  discordId: string;
  avatarURI: string;
  verified: boolean;
  mfaEnabled: boolean;
  discriminator: string;
  locale: string;
}

export interface AuthObject {
  user: User;
}

export async function isLoggedIn (): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    if (!feathersClient.authentication.authenticated) {
      feathersClient.authenticate()
        .then(() => resolve(true))
        .catch(() => resolve(false));
    }
  });
}

export default feathersClient;
