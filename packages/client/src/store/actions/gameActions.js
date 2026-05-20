// src/store/actions/gameActions.js
import axios from 'axios';
import { initGameSession, setStreamStatus } from '../slices/gameStreamSlice';

export const createAndStartGame = (gameData) => async (dispatch) => {
  try {
    // 1. Create game on server (also creates a stream in the same transaction)
    const response = await axios.post('/api/games', gameData);
    const { id, streamId } = response.data.game;

    // 2. Update store with session details
    dispatch(
      initGameSession({
        gameId: id,
        streamId: streamId,
        role: 'HOST',
      })
    );

    // 3. Set game status to ACTIVE
    dispatch(setStreamStatus('ACTIVE'));

    return { gameId: id, streamId };
  } catch (error) {
    console.error('Failed to create game:', error);
    throw error;
  }
};
