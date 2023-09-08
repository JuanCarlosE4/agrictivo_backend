import { Model, DataTypes } from 'sequelize'
import db from '../config/dbconnection.js'
import { date } from '../utils/generateDate.js';
const today_date = await date(); // OBTENER LA FECHA Y HORA ACTUAL GMT-5

class FincaModel extends Model { }

FincaModel.init(
    {
        id_finca: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name_finca: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fk_vereda_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fk_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.NOW,
            allowNull: false,
            defaultValue: today_date,
            field: "created_at_finca",
        },
        updatedAt: {
            type: DataTypes.NOW,
            allowNull: false,
            defaultValue: today_date,
            field: "updated_at_finca",
        },
    },
    {
        db,
        sequelize: db,
        modelName: "FincaModel",
        tableName: "finca",
    }
);

export default FincaModel