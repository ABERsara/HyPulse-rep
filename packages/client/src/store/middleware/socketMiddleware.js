import { updateBalances } from '../slices/walletSlice';
import * as socketService from '../../services/socket.service';
import { SOCKET_EVENTS } from '@hypulse/shared';

export const socketMiddleware = () => (store) => {
  const setupListener = () => {
    const currentSocket = socketService.getAppSocket();

    if (currentSocket) {
      // Remove previous listener to avoid duplicates
      currentSocket.off(SOCKET_EVENTS.WALLET.BALANCE_UPDATE);

      currentSocket.on(SOCKET_EVENTS.WALLET.BALANCE_UPDATE, (data) => {
        store.dispatch(updateBalances(data));
      });
    } else {
      setTimeout(setupListener, 1000);
    }
  };

  setupListener();

  return (next) => (action) => next(action);
};
