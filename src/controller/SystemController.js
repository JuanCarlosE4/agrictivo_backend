import SystemModel from '../model/SystemModel.js';
import ResponseApi from '../utils/responseapi.js';
// ERROR PARA EL CATCH
import { httpError } from '../utils/handleError.js';

// METODO PARA LISTAR TODOS LOS SISTEMAS
export const allSystem = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        // CONSULTAR A LA BD TODOS LOS SISTEMAS
        const systems = await SystemModel.findAll()
        // SI EXISTE POR LO MENOS UNO
        if (systems.length > 0) {
            responseapi.setResult(systems)
            // SI NO EXISTE LA RESPUESTAAPI TOMA LOS VALORES
        } else {
            responseapi.setStatus(404, 'info', 'No existen sistemas registrados')
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

// METODO PARA CONSULTAR POR ID
export const getSystem = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_system } = req.params
        const system = await SystemModel.findOne({
            where: {
                id_system: id_system,
            },
        });
        if (system) {
            responseapi.setResult(system);
        } else {
            responseapi.setStatus(404, "info", "No existe el sistema solicitado");
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

// METODO CREATE
export const createSystem = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        // OBTENER LOS DATOS PROPORCIONADOS
        const { name_system } = req.body

        // CONSULTA A LA BD PARA VER SI YA EXISTE UN ROL CON LOS MISMOS DATOS
        const system = await SystemModel.findOne({
            attributes: ['name_system'],
            where: {
                name_system: name_system
            }
        });
        if (system) {
            responseapi.setStatus(409, "info", "Ya existe un sistema con esos datos")
        } else {
            await SystemModel.create({
                name_system
            })
                .then((succes) => {
                    responseapi.setStatus(201, "success", "Nuevo sistema registrado correctamente")
                })
                .catch((error) => {
                    console.error("*** Error crear sistema ****", error)
                    responseapi.setStatus(500, "error", "Error al registrar el sistema")
                })
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());
    } catch (error) {
        httpError(res, error)
    }
};

/* METODO UPDATE */
export const updateSystem = async (req, res) => {
    const responseapi = new ResponseApi();

    try {
        const { id_system } = req.params
        const { name_system } = req.body

        // CONSULTA A LA BD PARA VER SI YA EXISTE UN ROL CON LOS MISMOS DATOS
        const system = await SystemModel.findOne({
            attributes: ['name_system'],
            where: {
                name_system: name_system
            }
        });

        if (system) {
            responseapi.setStatus(409, "info", "Ya existe un sistema con esos datos")
        } else {
            await SystemModel.update({
                name_system
            },
                {
                    where: {
                        id_system: id_system
                    }
                }
            ).then((success) => {
                if (success[0] > 0) {
                    responseapi.setStatus(200, "success", "Sistema actualizado correctamente")
                } else {
                    responseapi.setStatus(404, "info", "No existe el sistema solicitado");
                }
            })
                .catch((err) => {
                    console.error("*** Error actualizar sistema ****", error)
                    responseapi.setStatus(500, "error", "Error al actualizar el sistema")
                });
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

/* METODO DELETE */
export const deleteSystem = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_system } = req.params

        await SystemModel.destroy({ where: { id_system: id_system } })
            .then((succes) => {
                if (succes > 0) {
                    responseapi.setStatus(200, "success", "Sistema eliminado correctamente")
                } else {
                    responseapi.setStatus(404, "info", "No existe el sistema solicitado");
                }
            })
            .catch((error) => {
                console.error("*** Error eliminar sistema ****", error)
                responseapi.setStatus(500, "error", "Error al eliminar el sistema")
            })
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};