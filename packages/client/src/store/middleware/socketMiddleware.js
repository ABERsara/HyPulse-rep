import { updateBalances } from '../slices/walletSlice';
import * as socketService from '../../services/socket.service';

export const socketMiddleware = () => (store) => {
  const setupListener = () => {
    const currentSocket = socketService.getAppSocket();

    if (currentSocket) {
      // Remove previous listener to avoid duplicates
      currentSocket.off('balance_update');

      currentSocket.on('balance_update', (data) => {
        store.dispatch(updateBalances(data));
      });
    } else {
      setTimeout(setupListener, 1000);
    }
  };

  setupListener();

  return (next) => (action) => next(action);
};
