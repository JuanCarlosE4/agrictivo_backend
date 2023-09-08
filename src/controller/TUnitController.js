import TUnitModel from '../model/TUnitModel.js'
import ResponseApi from '../utils/responseapi.js';
// ERROR PARA EL CATCH
import { httpError } from '../utils/handleError.js';

// METODO PARA LISTAR TODOS LOS ROLES
export const allTUnit = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        // CONSULTAR A LA BD TODOS LOS ROLES
        const tunits = await TUnitModel.findAll()
        // SI EXISTE POR LO MENOS UNO
        if (tunits.length > 0) {
            responseapi.setResult(tunits)
            // SI NO EXISTE LA RESPUESTAAPI TOMA LOS VALORES
        } else {
            responseapi.setStatus(404, 'info', 'No existen unidades de tiempo registradas')
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());
    } catch (error) {
        httpError(res, error)
    }
};

// METODO PARA CONSULTAR POR ID
export const getTUnit = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_tunit } = req.params
        const tunit = await TUnitModel.findOne({
            where: {
                id_tunit: id_tunit,
            },
        });
        if (tunit) {
            responseapi.setResult(tunit);
        } else {
            responseapi.setStatus(404, "info", "No existe la unidad de tiempo solicitada");
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

// METODO CREATE
export const createTUnit = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        // OBTENER LOS DATOS PROPORCIONADOS
        const { name_tunit } = req.body

        // CONSULTA A LA BD PARA VER SI YA EXISTE UN ROL CON LOS MISMOS DATOS
        const tunit = await TUnitModel.findOne({
            attributes: ['name_tunit'],
            where: {
                name_tunit: name_tunit
            }
        });

        if (!tunit) {
            await TUnitModel.create({
                name_tunit
            })
                .then((succes) => {
                    responseapi.setStatus(201, "success", "Unidad de tiempo creada con exito")
                })
                .catch((error) => {
                    console.error("*** Error crear unidad tiempo ****", error)
                    responseapi.setStatus(500, "error", "Error al registrar la unidad de tiempo")
                })
        } else {
            responseapi.setStatus(409, "info", "Ya existe una unidad de tiempo con esos datos")
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());
    } catch (error) {
        httpError(res, error)
    }
};

/* METODO UPDATE */
export const updateTUnit = async (req, res) => {
    const responseapi = new ResponseApi();

    try {
        const { id_tunit } = req.params
        const { name_tunit } = req.body

        await TUnitModel.update({
            name_tunit
        },
            {
                where: {
                    id_tunit: id_tunit
                }
            }
        ).then((success) => {
            if (success[0] > 0) {
                responseapi.setStatus(200, "success", "Unidad de tiempo actualizada correctamente")
            } else {
                responseapi.setStatus(404, "info", "No existe la unidad de tiempo solicitada");
            }
        })
            .catch((err) => {
                console.error("*** Error actualizar unidad tiempo ****", err)
                responseapi.setStatus(500, "error", "Error al actualizar la unidad de tiempo")
            });
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

/* METODO DELETE */
export const deleteTUnit = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_tunit } = req.params
        await TUnitModel.destroy({ where: { id_tunit: id_tunit } })
            .then((succes) => {
                if (succes > 0) {
                    responseapi.setStatus(200, "success", "Unidad de tiempo eliminada correctamente")
                } else {
                    responseapi.setStatus(404, "info", "No existe la unidad de tiempo solicitada");
                }
            })
            .catch((error) => {
                console.error("*** Error eliminar unidad tiempo ****", error)
                responseapi.setStatus(500, "error", "Error al eliminar la unidad de tiempo")
            })
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};