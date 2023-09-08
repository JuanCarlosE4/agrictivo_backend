import WUnitModel from '../model/WUnitModel.js'
import ResponseApi from '../utils/responseapi.js';
// ERROR PARA EL CATCH
import { httpError } from '../utils/handleError.js';

// METODO PARA LISTAR TODOS LOS ROLES
export const allWUnit = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        // CONSULTAR A LA BD TODOS LOS ROLES
        const wunits = await WUnitModel.findAll()
        // SI EXISTE POR LO MENOS UNO
        if (wunits.length > 0) {
            responseapi.setResult(wunits)
            // SI NO EXISTE LA RESPUESTAAPI TOMA LOS VALORES
        } else {
            responseapi.setStatus(404, 'info', 'No existen unidades de peso registradas')
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());
    } catch (error) {
        httpError(res, error)
    }
};

// METODO PARA CONSULTAR POR ID
export const getWUnit = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_wunit } = req.params
        const wunit = await WUnitModel.findOne({
            where: {
                id_wunit: id_wunit,
            },
        });
        if (wunit) {
            responseapi.setResult(wunit);
        } else {
            responseapi.setStatus(404, "info", "No existe la unidad de peso solicitada");
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

// METODO CREATE
export const createWUnit = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        // OBTENER LOS DATOS PROPORCIONADOS
        const { name_wunit } = req.body

        // CONSULTA A LA BD PARA VER SI YA EXISTE UN ROL CON LOS MISMOS DATOS
        const wunit = await WUnitModel.findOne({
            attributes: ['name_wunit'],
            where: {
                name_wunit: name_wunit
            }
        });

        if (!wunit) {
            await WUnitModel.create({
                name_wunit
            })
                .then((succes) => {
                    responseapi.setStatus(201, "success", "Unidad de peso creada con exito")
                })
                .catch((error) => {
                    console.error("*** Error crear unidad peso ****", error)
                    responseapi.setStatus(500, "error", "Error al registrar la unidad de peso")
                })
        } else {
            responseapi.setStatus(409, "info", "Ya existe una unidad de peso con esos datos")
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());
    } catch (error) {
        httpError(res, error)
    }
};

/* METODO UPDATE */
export const updateWUnit = async (req, res) => {
    const responseapi = new ResponseApi();

    try {
        const { id_wunit } = req.params
        const { name_wunit } = req.body

        await WUnitModel.update({
            name_wunit
        },
            {
                where: {
                    id_wunit: id_wunit
                }
            }
        ).then((success) => {
            if (success[0] > 0) {
                responseapi.setStatus(200, "success", "Unidad de peso actualizada correctamente")
            } else {
                responseapi.setStatus(404, "info", "No existe la unidad de peso solicitada");
            }
        })
            .catch((err) => {
                console.error("*** Error actualizar unidad peso ****", err)
                responseapi.setStatus(500, "error", "Error al actualizar la unidad de peso")
            });
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

/* METODO DELETE */
export const deleteWUnit = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_wunit } = req.params
        await WUnitModel.destroy({ where: { id_wunit: id_wunit } })
            .then((succes) => {
                if (succes > 0) {
                    responseapi.setStatus(200, "success", "Unidad de peso eliminada correctamente")
                } else {
                    responseapi.setStatus(404, "info", "No existe la unidad de peso solicitada");
                }
            })
            .catch((error) => {
                console.error("*** Error eliminar unidad peso ****", error)
                responseapi.setStatus(500, "error", "Error al eliminar la unidad de peso")
            })
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};