import { Model, DataTypes } from 'sequelize'
import db from '../config/dbconnection.js'
import { date } from '../utils/generateDate.js';
const today_date = await date(); // OBTENER LA FECHA Y HORA ACTUAL GMT-5

class MunicipalityModel extends Model { }

MunicipalityModel.init(
    {
        id_municipality: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name_municipality: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fk_department_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.NOW,
            allowNull: false,
            defaultValue: today_date,
            field: "created_at_municipality",
        },
        updatedAt: {
            type: DataTypes.NOW,
            allowNull: false,
            defaultValue: today_date,
            field: "updated_at_municipality",
        },
    },
    {
        db,
        sequelize: db,
        modelName: "MunicipalityModel",
        tableName: "municipality",
    }
);

export default MunicipalityModel