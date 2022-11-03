import { DataTypes, Model } from 'sequelize';

class Todos extends Model { };

Todos.tables = {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isCompleted: {
        type: DataTypes.TINYINT(4),
        allowNull: false,
        defaultValue: 0
    },
    isCompletedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
};

Todos.options = {
    underscored: true,
    tableName: 'todos'
};


export default Todos;