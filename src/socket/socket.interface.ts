import { Socket } from 'socket.io';
export interface SocketInterface extends Socket {
  resources: {
    audio: boolean;
    video: boolean;
    screen: boolean;
  };
  room?: string;
}
