import { Model, DataTypes } from 'sequelize'
import db from '../config/dbconnection.js'
import { date } from '../utils/generateDate.js';
const today_date = await date(); // OBTENER LA FECHA Y HORA ACTUAL GMT-5

class RoleModel extends Model { }

RoleModel.init(
    {
        id_role: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name_role: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.NOW,
            allowNull: false,
            defaultValue: today_date,
            field: "created_at_role",
        },
        updatedAt: {
            type: DataTypes.NOW,
            allowNull: false,
            defaultValue: today_date,
            field: "updated_at_role",
        },
    },
    {
        db,
        sequelize: db,
        modelName: "RoleModel",
        tableName: "role",
    }
);

export default RoleModel