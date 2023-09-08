import { Model, DataTypes } from 'sequelize'
import db from '../config/dbconnection.js'
import { date } from '../utils/generateDate.js';
const today_date = await date(); // OBTENER LA FECHA Y HORA ACTUAL GMT-5

class MedicionModel extends Model { }

MedicionModel.init(
    {
        id_medicion: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        promedio_medicion: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        pspromedio_medicion: DataTypes.DOUBLE,
        fk_wunit_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        talla_medicion: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        fk_munit_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        desecho: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        observacion_medicion: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fk_cultive_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.NOW,
            allowNull: false,
            defaultValue: today_date,
            field: "created_at_medicion",
        },
        updatedAt: {
            type: DataTypes.NOW,
            allowNull: false,
            defaultValue: today_date,
            field: "updated_at_medicion",
        },
    },
    {
        db,
        sequelize: db,
        modelName: "MedicionModel",
        tableName: "medicion",
    }
);

export default MedicionModel