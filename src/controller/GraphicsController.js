import MSensorModel from '../model/Medicion_SensorModel.js';
import { Sequelize } from 'sequelize';
import { activeIntervals } from '../app.js';

// CONSULTA
const consult = async (id_cultive, id_tsensor) => {
    let response = await MSensorModel.findAll({
        where: {
            [Sequelize.Op.and]: [{ fk_cultive_id: id_cultive }, { fk_tsensor_id: id_tsensor }]
        },
        attributes: ['lectura_msensor'],
        order: [['id_msensor', 'DESC']],
        limit: 10,
    });
    console.log("Datos ");
    return response;
};

const addIntervalForUser = (socketId, intervalId, graphName) => {
    if (!activeIntervals[socketId]) {
        activeIntervals[socketId] = {};
    }
    activeIntervals[socketId][graphName] = intervalId;
    console.log("********** SOCKET ID N° ********** ", socketId);
};

// GRAFICA 1
export const Graph1 = (socket, data) => {
    if (!data) {
    } else {
        const [id_cultive, id_tsensor] = data.split(',')
        const intervalId = setInterval(async () => {
            try {
                let data = await consult(id_cultive.trim(), id_tsensor.trim())
                socket.emit('grafica1', data);
            } catch (error) {
                console.error("Error al consultar la base de datos:", error);
            }
        }, 1000);
        addIntervalForUser(socket.id, intervalId, 'graph1');
    }
};
// GRAFICA 2
export const Graph2 = (socket, data) => {
    if (!data) {
    } else {
        const [id_cultive, id_tsensor] = data.split(',')
        const intervalId = setInterval(async () => {
            try {
                let data = await consult(id_cultive.trim(), id_tsensor.trim())
                socket.emit('grafica2', data);
            } catch (error) {
                console.error("Error al consultar la base de datos:", error);
            }
        }, 1000);
        addIntervalForUser(socket.id, intervalId, 'graph2');
    }
};
// GRAFICA 3
export const Graph3 = (socket, data) => {
    if (!data) {
    } else {
        const [id_cultive, id_tsensor] = data.split(',')
        const intervalId = setInterval(async () => {
            try {
                let data = await consult(id_cultive.trim(), id_tsensor.trim())
                socket.emit('grafica3', data);
            } catch (error) {
                console.error("Error al consultar la base de datos:", error);
            }
        }, 1000);
        addIntervalForUser(socket.id, intervalId, 'graph3');
    }
};
// GRAFICA 4
export const Graph4 = (socket, data) => {
    if (!data) {
    } else {
        const [id_cultive, id_tsensor] = data.split(',')
        const intervalId = setInterval(async () => {
            try {
                let data = await consult(id_cultive.trim(), id_tsensor.trim())
                socket.emit('grafica4', data);
            } catch (error) {
                console.error("Error al consultar la base de datos:", error);
            }
        }, 1000);
        addIntervalForUser(socket.id, intervalId, 'graph4');
    }
};