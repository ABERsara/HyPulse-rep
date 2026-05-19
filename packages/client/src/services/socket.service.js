/**
 * socket.service.js (client)
 *
 * Manages two separate Socket.IO connections:
 *   appSocket   — main server (game events, notifications, chat)
 *   mediaSocket — media server (WebRTC video/audio streaming)
 *
 * connectMediaSocket uses promise dedup to prevent concurrent duplicate connects.
 * emitPromise / emitMediaPromise wrap emit in a Promise for convenient async/await use.
 *
 * Depends on: auth.service.js (auth token), EXPO_PUBLIC_MEDIA_SERVER_URL (ENV)
 * Used by: any screen that needs to send/receive realtime events
 */
import { io } from 'socket.io-client';
import { authService } from './auth.service';

const APP_SERVER_URL = process.env.EXPO_PUBLIC_API_URL;

let appSocketInstance = null;
let mediaSocketInstance = null;
let mediaSocketConnectPromise = null;

const getMediaServerUrl = () => {
  return process.env.EXPO_PUBLIC_MEDIA_SERVER_URL;
};

export const getAppSocket = () => appSocketInstance;

export const connectAppSocket = async () => {
  if (appSocketInstance && appSocketInstance.connected)
    return appSocketInstance;
  const token = await authService.getToken();
  if (!token) return null;

  appSocketInstance = io(APP_SERVER_URL, {
    auth: { token },
    transports: ['polling', 'websocket'],
    reconnection: true,
  });
  return appSocketInstance;
};

export const connectMediaSocket = async () => {
  if (mediaSocketInstance && mediaSocketInstance.connected)
    return mediaSocketInstance;
  if (mediaSocketConnectPromise) return mediaSocketConnectPromise;

  mediaSocketConnectPromise = new Promise((resolve, reject) => {
    authService
      .getToken()
      .then((token) => {
        if (!token) {
          mediaSocketConnectPromise = null;
          return reject(new Error('No token found'));
        }

        const mediaUrl = getMediaServerUrl();
        mediaSocketInstance = io(mediaUrl, {
          auth: { token },
          transports: ['websocket'],
          reconnection: true,
          forceNew: true,
        });

        mediaSocketInstance.on('connect', () => {
          mediaSocketConnectPromise = null;
          resolve(mediaSocketInstance);
        });

        mediaSocketInstance.on('connect_error', (error) => {
          mediaSocketConnectPromise = null;
          reject(error);
        });
      })
      .catch(reject);
  });

  return mediaSocketConnectPromise;
};

export const emitPromise = (type, data) => {
  return new Promise((resolve, reject) => {
    connectAppSocket()
      .then((activeSocket) => {
        if (!activeSocket || !activeSocket.connected)
          return reject(new Error('App socket not connected'));
        activeSocket.emit(type, data, (response) => {
          if (response && response.error) reject(new Error(response.error));
          else resolve(response);
        });
      })
      .catch(reject);
  });
};

export const emitMediaPromise = (type, data) => {
  return new Promise((resolve, reject) => {
    connectMediaSocket()
      .then((activeSocket) => {
        if (!activeSocket || !activeSocket.connected)
          return reject(new Error('Media socket not connected'));
        activeSocket.emit(type, data, (response) => {
          if (response && response.error) reject(new Error(response.error));
          else resolve(response);
        });
      })
      .catch(reject);
  });
};
