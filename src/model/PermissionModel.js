import { Model, DataTypes } from 'sequelize'
import db from '../config/dbconnection.js'
import { date } from '../utils/generateDate.js';
const today_date = await date(); // OBTENER LA FECHA Y HORA ACTUAL GMT-5

class PermissionModel extends Model { }

PermissionModel.init(
    {
        id_permission: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name_permission: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.NOW,
            allowNull: false,
            defaultValue: today_date,
            field: "created_at_permission",
        },
        updatedAt: {
            type: DataTypes.NOW,
            allowNull: false,
            defaultValue: today_date,
            field: "updated_at_permission",
        },
    },
    {
        db,
        sequelize: db,
        modelName: "PermissionModel",
        tableName: "permission",
    }
);

export default PermissionModel