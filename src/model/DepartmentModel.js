import { Model, DataTypes } from 'sequelize'
import db from '../config/dbconnection.js'
import { date } from '../utils/generateDate.js';
const today_date = await date(); // OBTENER LA FECHA Y HORA ACTUAL GMT-5

class DepartmentModel extends Model { }

DepartmentModel.init(
    {
        id_department: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name_department: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.NOW,
            allowNull: false,
            defaultValue: today_date,
            field: "created_at_department",
        },
        updatedAt: {
            type: DataTypes.NOW,
            allowNull: false,
            defaultValue: today_date,
            field: "updated_at_department",
        },
    },
    {
        db,
        sequelize: db,
        modelName: "DepartmentModel",
        tableName: "department",
    }
);

export default DepartmentModel