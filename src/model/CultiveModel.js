import { Model, DataTypes } from 'sequelize'
import db from '../config/dbconnection.js'
import { date } from '../utils/generateDate.js';
const today_date = await date(); // OBTENER LA FECHA Y HORA ACTUAL GMT-5

class CultiveModel extends Model { }

CultiveModel.init(
    {
        id_cultive: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name_cultive: {
            type: DataTypes.STRING,
            allowNull: false
        },
        capacidad_cultive: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        total_cultive: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        fk_finca_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fk_subcategory_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.NOW,
            allowNull: false,
            defaultValue: today_date,
            field: "created_at_cultive",
        },
        updatedAt: {
            type: DataTypes.NOW,
            allowNull: false,
            defaultValue: today_date,
            field: "updated_at_cultive",
        },
    },
    {
        db,
        sequelize: db,
        modelName: "CultiveModel",
        tableName: "cultive",
    }
);

export default CultiveModel