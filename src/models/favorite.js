module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Favorite', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: "L'ID de l'utilisateur est requis" },
                isInt: { msg: "L'ID de l'utilisateur doit être un nombre entier" }
            }
        },
        monumentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: "L'ID du monument est requis" },
                isInt: { msg: "L'ID du monument doit être un nombre entier" }
            }
        }
    }, {
        timestamps: true,
        createdAt: 'created',
        updatedAt: false,
        indexes: [
            {
                unique: true,
                fields: ['userId', 'monumentId'],
                name: 'unique_user_monument_favorite'
            }
        ]
    });
};