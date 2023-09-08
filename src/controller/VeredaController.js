import VeredaModel from '../model/VeredaModel.js'
import ResponseApi from '../utils/responseapi.js';
import { Sequelize } from 'sequelize';
// ERROR PARA EL CATCH
import { httpError } from '../utils/handleError.js';

// METODO PARA LISTAR TODOS LOS ROLES
export const allVereda = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        // CONSULTAR A LA BD TODOS LOS ROLES
        const veredas = await VeredaModel.findAll()
        // SI EXISTE POR LO MENOS UNO
        if (veredas.length > 0) {
            responseapi.setResult(veredas)
            // SI NO EXISTE LA RESPUESTAAPI TOMA LOS VALORES
        } else {
            responseapi.setStatus(404, 'info', 'No existen veredas registradas')
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());
    } catch (error) {
        httpError(res, error)
    }
};

// METODO PARA CONSULTAR POR ID
export const getVereda = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_vereda } = req.params
        const vereda = await VeredaModel.findOne({
            where: {
                id_vereda: id_vereda,
            },
        });
        if (vereda) {
            responseapi.setResult(vereda);
        } else {
            responseapi.setStatus(404, "info", "No existe la vereda solicitada");
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

// METODO CREATE
export const createVereda = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        // OBTENER LOS DATOS PROPORCIONADOS
        const { name_vereda, fk_municipality_id } = req.body

        // CONSULTA A LA BD PARA VER SI YA EXISTE UN ROL CON LOS MISMOS DATOS
        const vereda = await VeredaModel.findOne({
            attributes: ['name_vereda'],
            where: {
                [Sequelize.Op.and]: [
                    { name_vereda: name_vereda },
                    { fk_municipality_id: fk_municipality_id }
                ]
            }
        });

        if (!vereda) {
            await VeredaModel.create({
                name_vereda, fk_municipality_id
            })
                .then((succes) => {
                    responseapi.setStatus(201, "success", "Vereda creada con exito")
                })
                .catch((error) => {
                    console.error("*** Error crear vereda ****", error)
                    responseapi.setStatus(500, "error", "Error al registrar la vereda")
                })
        } else {
            responseapi.setStatus(409, "info", "Ya existe una vereda con esos datos")
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());
    } catch (error) {
        httpError(res, error)
    }
};

/* METODO UPDATE */
export const updateVereda = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_vereda } = req.params
        const { name_vereda, fk_municipality_id } = req.body

        await VeredaModel.update({
            name_vereda, fk_municipality_id
        },
            {
                where: {
                    id_vereda: id_vereda
                }
            }
        ).then((success) => {
            if (success[0] > 0) {
                responseapi.setStatus(200, "success", "Vereda actualizada correctamente")
            } else {
                responseapi.setStatus(404, "info", "No existe la vereda solicitada");
            }
        })
            .catch((err) => {
                console.error("*** Error actualizar vereda ****", err)
                responseapi.setStatus(500, "error", "Error al actualizar la vereda")
            });
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

/* METODO DELETE */
export const deleteVereda = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_vereda } = req.params
        await VeredaModel.destroy({ where: { id_vereda: id_vereda } })
            .then((succes) => {
                if (succes > 0) {
                    responseapi.setStatus(200, "success", "Vereda eliminada correctamente")
                } else {
                    responseapi.setStatus(404, "info", "No existe la vereda solicitada");
                }
            })
            .catch((error) => {
                console.error("*** Error eliminar vereda ****", error)
                responseapi.setStatus(500, "error", "Error al eliminar la vereda")
            })
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

// METODO PARA LISTAR POR MUNICIPIO
export const selectedMunicipality = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_municipality } = req.params
        const veredas = await VeredaModel.findAll({
            where: {
                fk_municipality_id: id_municipality,
            },
        })
        if (veredas.length > 0) {
            responseapi.setResult(veredas);
        } else {
            responseapi.setStatus(404, "info", "No existen veredas registradas");
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};