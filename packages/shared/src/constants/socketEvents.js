// packages/shared/src/constants/socketEvents.js

export const SOCKET_EVENTS = {
  // General system events
  SYSTEM: {
    DISCONNECT: 'disconnect',
    ERROR: 'error',
  },
  // Wallet events (App-Server)
  WALLET: {
    BALANCE_UPDATE: 'balance_update',
  },
  // Game events (App-Server)
  GAME: {
    CREATE: 'game:create',
    JOIN: 'game:join_room',
    PLACE_BET: 'game:place_bet',
    STATUS_UPDATE: 'game:status_update',
    ROOM_UPDATE: 'game:room_update',
    INVITE_MODERATOR: 'game:invite_moderator',
    ACCEPT_MODERATOR: 'game:accept_moderator',
    REJECT_MODERATOR: 'game:reject_moderator',
    MODERATOR_INVITATION: 'game:moderator_invitation',
    MODERATOR_RESPONSE: 'game:moderator_response',
    ERROR: 'game:error',
  },

  // Stream events (Media-Server / Mediasoup)
  STREAM: {
    CREATE_ROOM: 'stream:create_room',
    INIT_BROADCAST: 'stream:init_broadcast',
    CREATE_TRANSPORT: 'stream:create_transport',
    CONNECT_TRANSPORT: 'stream:connect_transport',
    PRODUCE: 'stream:produce',
    CONSUME: 'stream:consume',
    JOIN: 'stream:join',
    START_RECORDING: 'stream:start_recording',
    ENDED: 'stream:ended',
  },
};
