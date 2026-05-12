// Stripe webhook — listens for payment confirmation, updates wallet, emits real-time notification
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object;

    const userId = intent.metadata?.userId;
    const baseCoins = Number(intent.metadata?.coins);

    if (!userId || isNaN(baseCoins)) {
      console.error('Webhook received with missing or invalid metadata');
      return res.status(400).json({ error: 'Missing required metadata' });
    }

    try {
      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          throw new Error(`User ${userId} not found`);
        }

        const isFirst = user.isFirstPurchase;
        const coinsToAdd = isFirst ? baseCoins * 2 : baseCoins;

        const updatedUser = await tx.user.update({
          where: { id: userId },
          data: {
            walletBalance: { increment: coinsToAdd },
            isFirstPurchase: false,
          },
        });

        await tx.transaction.create({
          data: {
            userId,
            type: 'PURCHASE',
            status: 'SUCCESS',
            amount: coinsToAdd,
            currency: 'COIN',
            description: isFirst ? 'First purchase bonus (x2)' : 'Coin purchase',
            metadata: {
              stripePaymentIntentId: intent.id,
              isFirstPurchase: isFirst,
              baseCoins,
              amountPaid: intent.amount / 100,
            },
          },
        });

        await tx.notification.create({
          data: {
            userId,
            title: 'Top-up successful!',
            message: `${coinsToAdd} coins added to your account.${isFirst ? ' First purchase bonus included!' : ''}`,
          },
        });

        return updatedUser;
      });

      const io = req.app.get('io');
      if (io) {
        // Prisma Decimal must be cast to Number before emitting
        const balanceToSend =
          typeof result.walletBalance === 'object'
            ? parseFloat(result.walletBalance)
            : result.walletBalance;

        io.to(userId).emit('wallet:updated', {
          newBalance: balanceToSend,
          timestamp: new Date().toISOString(),
          source: 'payment_webhook',
        });
      } else {
        console.warn('Socket.IO instance not found — real-time balance update skipped');
      }

      res.status(200).json({
        received: true,
        userId,
        newBalance: result.walletBalance,
      });
    } catch (error) {
      console.error('Webhook processing error:', error.message);
      return res.status(500).json({ error: 'Internal processing error' });
    }
  } else {
    res.json({ received: true });
  }
};
