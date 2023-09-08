import { Model, DataTypes } from 'sequelize'
import db from '../config/dbconnection.js'
import { date } from '../utils/generateDate.js';
const today_date = await date(); // OBTENER LA FECHA Y HORA ACTUAL GMT-5

class MSensorModel extends Model { }

MSensorModel.init(
    {
        id_msensor: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        lectura_msensor: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        fk_tsensor_id: {
            type: DataTypes.INTEGER,
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
            field: "created_at_msensor",
        },
        updatedAt: {
            type: DataTypes.NOW,
            allowNull: false,
            defaultValue: today_date,
            field: "updated_at_msensor",
        },
    },
    {
        db,
        sequelize: db,
        modelName: "MSensorModel",
        tableName: "sensor_medicion",
    }
);

export default MSensorModel