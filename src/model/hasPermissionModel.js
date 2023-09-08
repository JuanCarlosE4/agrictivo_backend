import { Model, DataTypes } from 'sequelize'
import db from '../config/dbconnection.js'
import { date } from '../utils/generateDate.js';
const today_date = await date(); // OBTENER LA FECHA Y HORA ACTUAL GMT-5

class HPermissionModel extends Model { }

HPermissionModel.init(
    {
        id_hpermission: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        fk_role_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        fk_permission_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.NOW,
            allowNull: false,
            defaultValue: today_date,
            field: "created_at_hpermission",
        },
        updatedAt: {
            type: DataTypes.NOW,
            allowNull: false,
            defaultValue: today_date,
            field: "updated_at_hpermission",
        },
    },
    {
        db,
        sequelize: db,
        modelName: "HPermissionModel",
        tableName: "haspermission",
    }
);

export default HPermissionModel