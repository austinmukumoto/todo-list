import { Sequelize, DataTypes, Model } from 'sequelize';

class Users extends Model { };

Users.tables = {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Uid: {
        type: DataTypes.STRING,
        defaultValue: Sequelize.UUIDV4
    },
    username:{
        type: DataTypes.STRING,
        allowNull: false
    },
    password:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    isActive: {
        type: DataTypes.TINYINT(4),
        allowNull: false,
        defaultValue: 1
    }
};

Users.options = {
    underscored: true,
    tableName: 'users'
};


export default Users;