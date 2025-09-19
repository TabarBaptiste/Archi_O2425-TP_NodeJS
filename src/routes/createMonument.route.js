const { MonumentModel } = require('../db/sequelize');
const { handleError } = require('../../helper');

module.exports = (app) => {
    app.post('/api/monuments', async (req, res) => {
        const { monument } = req.body;

        try {
            const createdMonument = await MonumentModel.create(monument);

            // Émettre un événement WebSocket pour notifier la création du nouveau monument
            const io = app.get('io');
            if (io) {
                const notificationData = {
                    event: "newMonument",
                    data: {
                        id: createdMonument.id,
                        title: createdMonument.title,
                        description: createdMonument.description,
                        createdAt: createdMonument.created || new Date()
                    }
                };
                
                // Diffuser à tous les clients connectés
                io.emit('newMonument', notificationData);
                console.log('Notification WebSocket envoyée pour le nouveau monument:', createdMonument.title);
            }

            const message = `Le monument ${createdMonument.title} a bien été créé.`;
            res.status(201).json({ message, data: createdMonument });

        } catch (error) {
            const message = "Le monument n'a pas pu être créé. Réessayez dans quelques instants.";
            return handleError(res, error, message);
        }
    });
};