// MODELO
import TSensorModel from '../model/Type_SensorModel.js';
// ESTRUCTURA API
import ResponseApi from '../utils/responseapi.js';
// ERROR PARA EL CATCH
import { httpError } from '../utils/handleError.js';

// METODO PARA LISTAR TODOS LOS TIPOS DE SENSORES
export const allTSensor = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        // CONSULTAR A LA BD TODOS LOS SENSORES
        const sensores = await TSensorModel.findAll()
        // SI EXISTE POR LO MENOS UNO
        if (sensores.length > 0) {
            responseapi.setResult(sensores)
            // SI NO EXISTE LA RESPUESTAAPI TOMA LOS VALORES
        } else {
            responseapi.setStatus(404, 'info', 'No existen sensores registrados')
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

// METODO PARA CONSULTAR POR ID
export const getTSensor = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_tsensor } = req.params
        const sensor = await TSensorModel.findOne({
            where: {
                id_tsensor: id_tsensor,
            },
        });
        if (sensor) {
            responseapi.setResult(sensor);
        } else {
            responseapi.setStatus(404, "info", "No existe el sensor solicitado");
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }

};

// METODO CREATE
export const createTSensor = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        // OBTENER LOS DATOS PROPORCIONADOS
        const { name_tsensor } = req.body

        // CONSULTA A LA BD PARA VER SI YA EXISTE UN SENSOR CON LOS MISMOS DATOS
        const sensor = await TSensorModel.findOne({
            attributes: ['name_tsensor'],
            where: {
                name_tsensor: name_tsensor
            }
        });

        if (!sensor) {
            await TSensorModel.create({
                name_tsensor
            })
                .then((succes) => {
                    responseapi.setStatus(201, "success", "Nuevo sensor agregado correctamente")
                })
                .catch((error) => {
                    console.error("*** Error crear tipo sensor ****", error)
                    responseapi.setStatus(500, "error", "Error al registrar el sensor")
                })
        } else {
            responseapi.setStatus(409, "info", "Ya existe un sensor el mismo nombre")
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }

};

/* METODO UPDATE */
export const updateTSensor = async (req, res) => {
    const responseapi = new ResponseApi();

    try {
        const { id_tsensor } = req.params
        const { name_tsensor } = req.body

        await TSensorModel.update({
            name_tsensor
        },
            {
                where: {
                    id_tsensor: id_tsensor
                }
            }
        ).then((success) => {
            if (success[0] > 0) {
                responseapi.setStatus(200, "success", "Sensor actualizado correctamente")
            } else {
                responseapi.setStatus(404, "info", "No existe el sensor solicitado");
            }
        })
            .catch((err) => {
                console.error("*** Error actualizar tipo sensor ****", error)
                responseapi.setStatus(500, "error", "Error al actualizar el sensor")
            });
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }

};

/* METODO DELETE */
export const deleteTSensor = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_tsensor } = req.params
        await TSensorModel.destroy({ where: { id_tsensor: id_tsensor } })
            .then((succes) => {
                if (succes > 0) {
                    responseapi.setStatus(200, "success", "Sensor eliminado correctamente")
                } else {
                    responseapi.setStatus(404, "info", "No existe el sensor solicitado");
                }
            })
            .catch((error) => {
                console.error("*** Error eliminar tipo sensor ****", error)
                responseapi.setStatus(500, "error", "Error al eliminar el sensor")
            })
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};