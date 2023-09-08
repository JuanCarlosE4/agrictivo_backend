import { Sequelize } from 'sequelize';
import database from '../env.js';

const sequelize = new Sequelize(
    database.database,
    database.user,
    database.password,
    {
        host: database.host,
        dialect: "mysql",
        port: database.port,
        difine: { timestamps: false },
    }
);

export default sequelize;