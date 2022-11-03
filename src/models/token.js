import { DataTypes, Model } from "sequelize";

class Token extends Model { };

Token.tables = {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    token:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    isActive: {
        type: DataTypes.TINYINT(4),
        allowNull: false,
        defaultValue: 0
    },
    expiresAt:{
        type: DataTypes.DATE,
        allowNull: false 
    }
};

Token.options = {
    underscored: true,
    tableName: "tokens"
};


export default Token;