import cron from 'node-cron';
import CartController from './controllers/cart.controller.js';

// Planifie le job pour exécuter toutes les minutes
cron.schedule('* * * * *', async () => {
    try {
        await CartController.releaseExpiredReservations();
        console.log('Expired reservations released');
    } catch (error) {
        console.error('Failed to release expired reservations:', error);
    }
});