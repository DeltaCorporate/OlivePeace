import cron from 'node-cron';
import CartController from './controllers/cart.controller.js';

// Planifie le job pour exécuter toutes les minutes
cron.schedule('* * * * *', async () => {
    try {
        await CartController.releaseExpiredReservations();
        console.log('réservation expirée');
    } catch (error) {
        console.error('Impossible de résilier la réservation:', error);
    }
});