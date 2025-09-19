const { FavoriteModel, MonumentModel } = require('../db/sequelize');
const { handleError } = require('../../helper');

/**
 * @swagger
 * /api/favorites/{monumentId}:
 *   delete:
 *     summary: Supprimer un monument des favoris
 *     description: Supprime un monument des favoris de l'utilisateur connecté
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
 *         description: L'ID du monument à supprimer des favoris
 *     responses:
 *       200:
 *         description: Favori supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: null
 *       404:
 *         description: Favori non trouvé
 *       401:
 *         description: Non authentifié
 */
module.exports = (app) => {
    app.delete('/api/favorites/:monumentId', async (req, res) => {
        const { monumentId } = req.params;
        const userId = req.user.id;

        try {
            // Chercher le favori à supprimer
            const favorite = await FavoriteModel.findOne({
                where: { userId, monumentId },
                include: [{
                    model: MonumentModel,
                    as: 'monument',
                    attributes: ['title']
                }]
            });

            if (!favorite) {
                return res.status(404).json({ 
                    message: "Ce monument n'est pas dans vos favoris", 
                    data: null 
                });
            }

            // Supprimer le favori
            await favorite.destroy();

            const message = `Le monument "${favorite.monument.title}" a été supprimé de vos favoris.`;
            res.status(200).json({ message, data: null });

        } catch (error) {
            const message = "Le favori n'a pas pu être supprimé. Réessayez dans quelques instants.";
            return handleError(res, error, message);
        }
    });
};