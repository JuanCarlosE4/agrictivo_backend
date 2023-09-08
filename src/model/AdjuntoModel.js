import { Model, DataTypes } from 'sequelize';
import db from '../config/dbconnection.js';
import { date } from '../utils/generateDate.js';
const today_date = await date(); // OBTENER LA FECHA Y HORA ACTUAL GMT-5

class AdjuntoModel extends Model { }

AdjuntoModel.init(
    {
        id_adjunto: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        archivo_adjunto: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fk_medicion_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.NOW,
            allowNull: false,
            defaultValue: today_date,
            field: "created_at_adjunto",
        },
        updatedAt: {
            type: DataTypes.NOW,
            allowNull: false,
            defaultValue: today_date,
            field: "updated_at_adjunto",
        },
    },
    {
        db,
        sequelize: db,
        modelName: "AdjuntoModel",
        tableName: "adjunto",
    }
);

export default AdjuntoModel