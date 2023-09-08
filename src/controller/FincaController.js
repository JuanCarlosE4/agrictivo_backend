import FincaModel from '../model/FincaModel.js'
import ResponseApi from '../utils/responseapi.js';
// ERROR PARA EL CATCH
import { httpError } from '../utils/handleError.js';

// METODO PARA LISTAR TODAS LAS FINCAS
export const allFinca = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        // CONSULTAR A LA BD TODOS LAS FINCAS
        const fincas = await FincaModel.findAll()
        // SI EXISTE POR LO MENOS UNO
        if (fincas.length > 0) {
            responseapi.setResult(fincas)
            // SI NO EXISTE LA RESPUESTAAPI TOMA LOS VALORES
        } else {
            responseapi.setStatus(404, 'info', 'No existen fincas registradas')
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

// METODO PARA LISTAR TODAS LAS FINCAS
export const allFincaUser = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const id_user = req.userId;
        // CONSULTAR A LA BD TODOS LAS FINCAS
        const fincas = await FincaModel.findAll({
            where: { fk_user_id: id_user, }
        })
        // SI EXISTE POR LO MENOS UNO
        if (fincas.length > 0) {
            responseapi.setResult(fincas)
            // SI NO EXISTE LA RESPUESTAAPI TOMA LOS VALORES
        } else {
            responseapi.setStatus(404, 'info', 'No existen fincas registradas')
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

// METODO PARA CONSULTAR POR ID
export const getFinca = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_finca } = req.params
        const finca = await FincaModel.findOne({
            where: {
                id_finca: id_finca,
            },
        });
        if (finca) {
            responseapi.setResult(finca);
        } else {
            responseapi.setStatus(404, "info", "No existe la finca solicitada");
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

// METODO CREATE
export const createFinca = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        // OBTENER LOS DATOS PROPORCIONADOS
        const fk_user_id = req.userId;
        const { name_finca, fk_vereda_id } = req.body

        await FincaModel.create({
            name_finca, fk_vereda_id, fk_user_id
        })
            .then((succes) => {
                responseapi.setStatus(201, "success", "Finca registrada correctamente")
            })
            .catch((error) => {
                console.error("*** Error crear finca ****", error)
                responseapi.setStatus(500, "error", "Error al registrar la finca")
            })
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

/* METODO UPDATE */
export const updateFinca = async (req, res) => {
    const responseapi = new ResponseApi();

    try {
        const { id_finca } = req.params
        const { name_finca, fk_vereda_id, fk_user_id } = req.body

        await FincaModel.update({
            name_finca, fk_vereda_id, fk_user_id
        },
            {
                where: {
                    id_finca: id_finca
                }
            }
        ).then((success) => {
            if (success[0] > 0) {
                responseapi.setStatus(200, "success", "Finca actualizada correctamente")
            } else {
                responseapi.setStatus(404, "info", "No existe la finca solicitada");
            }
        })
            .catch((err) => {
                console.error("*** Error actualizar finca ****", err)
                responseapi.setStatus(500, "error", "Error al actualizar la finca")
            });
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

/* METODO DELETE */
export const deleteFinca = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_finca } = req.params
        await FincaModel.destroy({ where: { id_finca: id_finca } })
            .then((succes) => {
                if (succes > 0) {
                    responseapi.setStatus(200, "success", "Finca eliminada correctamente")
                } else {
                    responseapi.setStatus(404, "info", "No existe la finca solicitada");
                }
            })
            .catch((error) => {
                console.error("*** Error eliminar finca ****", error)
                responseapi.setStatus(500, "error", "Error al eliminar la finca")
            })
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};