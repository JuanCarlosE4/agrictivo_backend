import { Model, DataTypes } from 'sequelize'
import db from '../config/dbconnection.js'
import { date } from '../utils/generateDate.js';
const today_date = await date(); // OBTENER LA FECHA Y HORA ACTUAL GMT-5

class SubcategoryModel extends Model { }

SubcategoryModel.init(
    {
        id_subcategory: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        img_subcategory: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name_subcategory: {
            type: DataTypes.STRING,
            allowNull: false
        },
        duration_subcategory: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        fk_tunit_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fk_category_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.NOW,
            allowNull: false,
            defaultValue: today_date,
            field: "created_at_subcategory",
        },
        updatedAt: {
            type: DataTypes.NOW,
            allowNull: false,
            defaultValue: today_date,
            field: "updated_at_subcategory",
        },
    },
    {
        db,
        sequelize: db,
        modelName: "SubcategoryModel",
        tableName: "subcategory",
    }
);

export default SubcategoryModel