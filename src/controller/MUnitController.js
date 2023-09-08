import MUnitModel from '../model/MUnitModel.js'
import ResponseApi from '../utils/responseapi.js';
// ERROR PARA EL CATCH
import { httpError } from '../utils/handleError.js';

// METODO PARA LISTAR TODOS LOS ROLES
export const allMUnit = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        // CONSULTAR A LA BD TODOS LOS ROLES
        const munits = await MUnitModel.findAll()
        // SI EXISTE POR LO MENOS UNO
        if (munits.length > 0) {
            responseapi.setResult(munits)
            // SI NO EXISTE LA RESPUESTAAPI TOMA LOS VALORES
        } else {
            responseapi.setStatus(404, 'info', 'No existen unidades de medida registradas')
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());
    } catch (error) {
        httpError(res, error)
    }
};

// METODO PARA CONSULTAR POR ID
export const getMUnit = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_munit } = req.params
        const munit = await MUnitModel.findOne({
            where: {
                id_munit: id_munit,
            },
        });
        if (munit) {
            responseapi.setResult(munit);
        } else {
            responseapi.setStatus(404, "info", "No existe la unidad de medida solicitada");
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

// METODO CREATE
export const createMUnit = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        // OBTENER LOS DATOS PROPORCIONADOS
        const { name_munit } = req.body

        // CONSULTA A LA BD PARA VER SI YA EXISTE UN ROL CON LOS MISMOS DATOS
        const munit = await MUnitModel.findOne({
            attributes: ['name_munit'],
            where: {
                name_munit: name_munit
            }
        });

        if (!munit) {
            await MUnitModel.create({
                name_munit
            })
                .then((succes) => {
                    responseapi.setStatus(201, "success", "Unidad de medida creada con exito")
                })
                .catch((error) => {
                    console.error("*** Error crear unidad medida ****", error)
                    responseapi.setStatus(500, "error", "Error al registrar la unidad de medida")
                })
        } else {
            responseapi.setStatus(409, "info", "Ya existe una unidad de medida con esos datos")
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());
    } catch (error) {
        httpError(res, error)
    }
};

/* METODO UPDATE */
export const updateMUnit = async (req, res) => {
    const responseapi = new ResponseApi();

    try {
        const { id_munit } = req.params
        const { name_munit } = req.body

        await MUnitModel.update({
            name_munit
        },
            {
                where: {
                    id_munit: id_munit
                }
            }
        ).then((success) => {
            if (success[0] > 0) {
                responseapi.setStatus(200, "success", "Unidad de medida actualizada correctamente")
            } else {
                responseapi.setStatus(404, "info", "No existe la unidad de medida solicitada");
            }
        })
            .catch((err) => {
                console.error("*** Error actualizar unidad medida ****", err)
                responseapi.setStatus(500, "error", "Error al actualizar la unidad de medida")
            });
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

/* METODO DELETE */
export const deleteMUnit = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_munit } = req.params
        await MUnitModel.destroy({ where: { id_munit: id_munit } })
            .then((succes) => {
                if (succes > 0) {
                    responseapi.setStatus(200, "success", "Unidad de medida eliminada correctamente")
                } else {
                    responseapi.setStatus(404, "info", "No existe la unidad de medida solicitada");
                }
            })
            .catch((error) => {
                console.error("*** Error eliminar unidad medida ****", error)
                responseapi.setStatus(500, "error", "Error al eliminar la unidad de medida")
            })
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};