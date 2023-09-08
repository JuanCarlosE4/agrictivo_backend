import MunicipalityModel from '../model/MunicipalityModel.js'
import ResponseApi from '../utils/responseapi.js';
import { Sequelize } from 'sequelize';
// ERROR PARA EL CATCH
import { httpError } from '../utils/handleError.js';

// METODO PARA LISTAR
export const allMunicipality = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        // CONSULTAR A LA BD TODOS LOS ROLES
        const municipalities = await MunicipalityModel.findAll()
        // SI EXISTE POR LO MENOS UNO
        if (municipalities.length > 0) {
            responseapi.setResult(municipalities)
            // SI NO EXISTE LA RESPUESTAAPI TOMA LOS VALORES
        } else {
            responseapi.setStatus(404, 'info', 'No existen municipios registrados')
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());
    } catch (error) {
        httpError(res, error)
    }
};

// METODO PARA CONSULTAR POR ID
export const getMunicipality = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_municipality } = req.params
        const municipality = await MunicipalityModel.findOne({
            where: {
                id_municipality: id_municipality,
            },
        });
        if (municipality) {
            responseapi.setResult(municipality);
        } else {
            responseapi.setStatus(404, "info", "No existe municipio solicitado");
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

// METODO CREATE
export const createMunicipality = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        // OBTENER LOS DATOS PROPORCIONADOS
        const { name_municipality, fk_department_id } = req.body

        // CONSULTA A LA BD PARA VER SI YA EXISTE UN ROL CON LOS MISMOS DATOS
        const municipality = await MunicipalityModel.findOne({
            attributes: ['name_municipality'],
            where: {
                [Sequelize.Op.and]: [
                    { name_municipality: name_municipality },
                    { fk_department_id: fk_department_id }
                ]
            }
        });

        if (!municipality) {
            await MunicipalityModel.create({
                name_municipality, fk_department_id
            })
                .then((succes) => {
                    responseapi.setStatus(201, "success", "Municipio creada con exito")
                })
                .catch((error) => {
                    console.error("*** Error crear municipio ****", error)
                    responseapi.setStatus(500, "error", "Error al registrar el municipio")
                })
        } else {
            responseapi.setStatus(409, "info", "Ya existe un municipio con esos datos")
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());
    } catch (error) {
        httpError(res, error)
    }
};

/* METODO UPDATE */
export const updateMunicipality = async (req, res) => {
    const responseapi = new ResponseApi();

    try {
        const { id_municipality } = req.params
        const { name_municipality, fk_department_id } = req.body

        await MunicipalityModel.update({
            name_municipality, fk_department_id
        },
            {
                where: {
                    id_municipality: id_municipality
                }
            }
        ).then((success) => {
            if (success[0] > 0) {
                responseapi.setStatus(200, "success", "Municipio actualizado correctamente")
            } else {
                responseapi.setStatus(404, "info", "No existe el municipio solicitado");
            }
        })
            .catch((err) => {
                console.error("*** Error actualizar municipio ****", err)
                responseapi.setStatus(500, "error", "Error al actualizar el municipio")
            });
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

/* METODO DELETE */
export const deleteMunicipality = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_municipality } = req.params
        await MunicipalityModel.destroy({ where: { id_municipality: id_municipality } })
            .then((succes) => {
                if (succes > 0) {
                    responseapi.setStatus(200, "success", "Municipio eliminado correctamente")
                } else {
                    responseapi.setStatus(404, "info", "No existe el municipio solicitado");
                }
            })
            .catch((error) => {
                console.error("*** Error eliminar municipio ****", error)
                responseapi.setStatus(500, "error", "Error al eliminar municipio")
            })
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

// METODO PARA LISTAR POR DEPARTAMENTO
export const selectedDepartment = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_department } = req.params
        const municipalities = await MunicipalityModel.findAll({
            where: {
                fk_department_id: id_department,
            },
        })
        if (municipalities.length > 0) {
            responseapi.setResult(municipalities);
        } else {
            responseapi.setStatus(404, "info", "No existen municipios registrados");
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};