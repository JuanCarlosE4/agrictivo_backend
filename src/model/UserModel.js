import { Model, DataTypes } from 'sequelize'
import db from '../config/dbconnection.js'
import { date } from '../utils/generateDate.js';
const today_date = await date(); // OBTENER LA FECHA Y HORA ACTUAL GMT-5

class UserModel extends Model { }

UserModel.init(
    {
        id_user: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        cedula_user: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        name_user: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email_user: DataTypes.STRING,
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        celular1: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        celular2: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        fk_role_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        token: DataTypes.STRING,
        createdAt: {
            type: DataTypes.NOW,
            allowNull: true,
            defaultValue: today_date,
            field: "created_at_user",
        },
        updatedAt: {
            type: DataTypes.NOW,
            allowNull: true,
            defaultValue: today_date,
            field: "updated_at_user",
        },
    },
    {
        db,
        sequelize: db,
        modelName: "UserModel",
        tableName: "user",
    }
);

export default UserModel