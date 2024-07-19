import CommandeMongoose from '../../mongoose/models/command.model.js';

export const denormalizeCommande = async (commande) => {
    try {
        // Récupérer les données de la commande
        const commandeData = commande.toJSON();

        // Récupérer les détails de la commande
        const commandeDetails = await commande.getCommandeDetails();
        commandeData.commandeDetails = commandeDetails.map(detail => detail.toJSON());

        // Calculer le prix total
        commandeData.price = commande.calculateTotalPrice();

        // Mettre à jour ou créer le document dans MongoDB
        let commandeMongo = await CommandeMongoose.findByIdAndUpdate(
            commande.id,
            commandeData,
            {
                upsert: true,
                new: true
            }
        );

        console.log('Commande denormalized successfully:', commandeMongo.id);
    } catch (error) {
        console.error('Failed to denormalize commande in MongoDB:', error);
    }
};