import { Model, DataTypes } from 'sequelize'
import db from '../config/dbconnection.js'
import { date } from '../utils/generateDate.js';
const today_date = await date(); // OBTENER LA FECHA Y HORA ACTUAL GMT-5

class CategoryModel extends Model { }

CategoryModel.init(
    {
        id_category: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        img_category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name_category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fk_system_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.NOW,
            allowNull: false,
            defaultValue: today_date,
            field: "created_at_category",
        },
        updatedAt: {
            type: DataTypes.NOW,
            allowNull: false,
            defaultValue: today_date,
            field: "updated_at_category",
        },
    },
    {
        db,
        sequelize: db,
        modelName: "CategoryModel",
        tableName: "category",
    }
);

export default CategoryModel