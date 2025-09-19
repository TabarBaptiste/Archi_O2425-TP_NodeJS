const { FavoriteModel, MonumentModel } = require('../db/sequelize');
const { handleError } = require('../../helper');

/**
 * @swagger
 * /api/favorites/{monumentId}:
 *   post:
 *     summary: Ajouter un monument aux favoris
 *     description: Ajoute un monument aux favoris de l'utilisateur connecté
 *     tags:
 *       - Favorites
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: monumentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'ID du monument à ajouter aux favoris
 *     responses:
 *       201:
 *         description: Favori ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Monument déjà en favoris ou données invalides
 *       404:
 *         description: Monument non trouvé
 *       401:
 *         description: Non authentifié
 */
module.exports = (app) => {
    app.post('/api/favorites/:monumentId', async (req, res) => {
        const { monumentId } = req.params;
        
        // Debug de l'authentification
        // console.log('req.user:', req.user);
        // console.log('req.headers.authorization:', req.headers.authorization);
        
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({ 
                message: "Utilisateur non authentifié", 
                data: null 
            });
        }

        try {
            // Vérifier que le monument existe
            const monument = await MonumentModel.findByPk(monumentId);
            if (!monument) {
                return res.status(404).json({ 
                    message: "Monument non trouvé", 
                    data: null 
                });
            }

            // Vérifier si le favori existe déjà
            const existingFavorite = await FavoriteModel.findOne({
                where: { userId, monumentId }
            });

            if (existingFavorite) {
                return res.status(400).json({ 
                    message: "Ce monument est déjà dans vos favoris", 
                    data: null 
                });
            }

            // Créer le favori
            const newFavorite = await FavoriteModel.create({
                userId,
                monumentId: parseInt(monumentId)
            });

            const message = `Le monument "${monument.title}" a été ajouté à vos favoris.`;
            res.status(201).json({ message, data: newFavorite });

        } catch (error) {
            const message = "Le favori n'a pas pu être ajouté. Réessayez dans quelques instants.";
            return handleError(res, error, message);
        }
    });
};