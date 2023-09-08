import { Model, DataTypes } from 'sequelize'
import db from '../config/dbconnection.js'
import { date } from '../utils/generateDate.js';
const today_date = await date(); // OBTENER LA FECHA Y HORA ACTUAL GMT-5

class VeredaModel extends Model { }

VeredaModel.init(
    {
        id_vereda: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name_vereda: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fk_municipality_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.NOW,
            allowNull: false,
            defaultValue: today_date,
            field: "created_at_vereda",
        },
        updatedAt: {
            type: DataTypes.NOW,
            allowNull: false,
            defaultValue: today_date,
            field: "updated_at_vereda",
        },
    },
    {
        db,
        sequelize: db,
        modelName: "VeredaModel",
        tableName: "vereda",
    }
);

export default VeredaModel