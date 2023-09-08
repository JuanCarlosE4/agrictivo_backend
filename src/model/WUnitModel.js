import { Model, DataTypes } from 'sequelize'
import db from '../config/dbconnection.js'
import { date } from '../utils/generateDate.js';
const today_date = await date(); // OBTENER LA FECHA Y HORA ACTUAL GMT-5

class WUnitModel extends Model { }

WUnitModel.init(
    {
        id_wunit: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name_wunit: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.NOW,
            allowNull: false,
            defaultValue: today_date,
            field: "created_at_wunit",
        },
        updatedAt: {
            type: DataTypes.NOW,
            allowNull: false,
            defaultValue: today_date,
            field: "updated_at_wunit",
        },
    },
    {
        db,
        sequelize: db,
        modelName: "WUnitModel",
        tableName: "weight_unit",
    }
);

export default WUnitModel