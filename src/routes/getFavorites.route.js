const { FavoriteModel, MonumentModel } = require('../db/sequelize');
const { handleError } = require('../../helper');

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Lister les monuments favoris
 *     description: Récupère la liste des monuments favoris de l'utilisateur connecté
 *     tags:
 *       - Favorites
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des favoris récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       userId:
 *                         type: integer
 *                       monumentId:
 *                         type: integer
 *                       created:
 *                         type: string
 *                         format: date-time
 *                       monument:
 *                         type: object
 *       401:
 *         description: Non authentifié
 */
module.exports = (app) => {
    app.get('/api/favorites', async (req, res) => {
        const userId = req.user.id;

        try {
            // Récupérer les favoris avec les détails des monuments
            const favorites = await FavoriteModel.findAll({
                where: { userId },
                include: [{
                    model: MonumentModel,
                    as: 'monument',
                    attributes: ['id', 'title', 'country', 'city', 'buildYear', 'picture', 'description']
                }],
                order: [['created', 'DESC']]
            });

            const message = favorites.length > 0 
                ? `${favorites.length} monument(s) trouvé(s) dans vos favoris.`
                : "Aucun favori trouvé.";

            res.status(200).json({ message, data: favorites });

        } catch (error) {
            const message = "Impossible de récupérer vos favoris. Réessayez dans quelques instants.";
            return handleError(res, error, message);
        }
    });
};