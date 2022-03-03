import io from 'socket.io-client';
import socketio from '@feathersjs/socketio-client';
import feathers from '@feathersjs/feathers';
import auth from '@feathersjs/authentication-client';
import User from '@/helpers/interfaces/user';
import config from '../../config';

const socket = io(config.backend, { transports: ['websocket'] });

const feathersClient = feathers();

feathersClient.configure(socketio(socket, { timeout: 30000 }));
feathersClient.configure(auth());
feathersClient.set('user', null);

export interface FeathersError {
  message: string;
  name: string;
  code: number;
  className: string;
  data?: unknown;
}

export interface AuthObject {
  user: User;
  accessToken: string;
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
