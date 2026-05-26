// src/utils/socketHelpers.js
// ✅ כלי עזר לסנכרון real-time של יתרות משתמשים

import { PrismaClient } from '@prisma/client';
import { SOCKET_EVENTS } from '@worldplay/shared';

/**
 * שידור עדכון יתרה לכל המשתמשים המעורבים
 *
 * @param {Object} io - מופע Socket.io
 * @param {Array<string>} userIds - מערך של IDs משתמשים
 * @returns {Promise<void>}
 */
export async function syncUserBalances(io, userIds) {
  if (!io) {
    console.warn('[SOCKET] IO instance not available - skipping balance sync');
    return;
  }

  if (!Array.isArray(userIds) || userIds.length === 0) {
    console.warn('[SOCKET] No user IDs provided for balance sync');
    return;
  }

  const prisma = new PrismaClient();

  try {
    console.log(`[SOCKET] Syncing balances for ${userIds.length} users...`);

    for (const userId of userIds) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          walletBalance: true,
        },
      });

      if (user) {
        // המרת Decimal ל-Number לשידור
        const balanceData = {
          newBalance: Number(user.walletBalance),
        };

        // שידור לחדר הפרטי של המשתמש
        io.to(userId).emit(SOCKET_EVENTS.WALLET.BALANCE_UPDATE, balanceData);

        console.log(
          `[SOCKET]  Updated balance for user ${userId}: ${balanceData.newBalance}`
        );
      } else {
        console.warn(`[SOCKET]  User ${userId} not found`);
      }
    }

    console.log('[SOCKET] Balance sync completed');
  } catch (error) {
    console.error('[SOCKET]  Error syncing balances:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * שידור עדכון ציון במשחק לכל המשתתפים
 *
 * @param {Object} io - מופע Socket.io
 * @param {string} gameId - מזהה המשחק
 * @returns {Promise<void>}
 */
export async function syncGameScores(io, gameId) {
  if (!io) {
    console.warn('[SOCKET] IO instance not available - skipping score sync');
    return;
  }

  const prisma = new PrismaClient();

  try {
    console.log(`[SOCKET] Syncing scores for game ${gameId}...`);

    const participants = await prisma.gameParticipant.findMany({
      where: { gameId },
      select: {
        userId: true,
        score: true,
        role: true,
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: { score: 'desc' },
    });

    if (participants.length === 0) {
      console.warn(`[SOCKET] No participants found for game ${gameId}`);
      return;
    }

    // המרת Decimal ל-Number
    const leaderboard = participants.map((p) => ({
      userId: p.userId,
      username: p.user.username,
      score: Number(p.score),
      role: p.role,
    }));

    // שידור לכל מי שבחדר המשחק
    io.to(gameId).emit('game:leaderboard_updated', {
      gameId,
      leaderboard,
      timestamp: new Date().toISOString(),
    });

    console.log(
      `[SOCKET] ✅ Synced scores for ${participants.length} participants`
    );
  } catch (error) {
    console.error('[SOCKET] ❌ Error syncing game scores:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * שידור אירוע כספי כללי (למעקב)
 *
 * @param {Object} io - מופע Socket.io
 * @param {string} gameId - מזהה המשחק
 * @param {string} eventType - סוג האירוע
 * @param {Object} data - נתונים נוספים
 */
export function broadcastEconomyEvent(io, gameId, eventType, data) {
  if (!io) return;

  io.to(gameId).emit('economy:event', {
    type: eventType,
    gameId,
    data,
    timestamp: new Date().toISOString(),
  });

  console.log(`[SOCKET] 📢 Broadcasted ${eventType} to game ${gameId}`);
}

/**
 * המרת Decimal ל-Number (פונקציית עזר)
 *
 * @param {Decimal|number} value - ערך לעיבוד
 * @returns {number}
 */
export function toNumber(value) {
  return value ? Number(value) : 0;
}
