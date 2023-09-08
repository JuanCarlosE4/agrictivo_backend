import { Model, DataTypes } from 'sequelize';
import db from '../config/dbconnection.js';
import { date } from '../utils/generateDate.js';
const today_date = await date(); // OBTENER LA FECHA Y HORA ACTUAL GMT-5

class BrokerModel extends Model { }

BrokerModel.init(
    {
        id_broker: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        clientid_broker: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username_broker: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password_broker: {
            type: DataTypes.STRING,
            allowNull: false
        },
        url_broker: {
            type: DataTypes.STRING,
            allowNull: false
        },
        topic_broker: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fk_finca_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.NOW,
            allowNull: false,
            defaultValue: today_date,
            field: "created_at_broker",
        },
        updatedAt: {
            type: DataTypes.NOW,
            allowNull: false,
            defaultValue: today_date,
            field: "updated_at_broker",
        },
    },
    {
        db,
        sequelize: db,
        modelName: "BrokerModel",
        tableName: "broker",
    }
);
export default BrokerModel