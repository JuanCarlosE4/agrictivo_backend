import DepartmentModel from '../model/DepartmentModel.js'
import ResponseApi from '../utils/responseapi.js';
// ERROR PARA EL CATCH
import { httpError } from '../utils/handleError.js';

// METODO PARA LISTAR TODOS LOS ROLES
export const allDepartment = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        // CONSULTAR A LA BD TODOS LOS ROLES
        const departments = await DepartmentModel.findAll()
        // SI EXISTE POR LO MENOS UNO
        if (departments.length > 0) {
            responseapi.setResult(departments)
            // SI NO EXISTE LA RESPUESTAAPI TOMA LOS VALORES
        } else {
            responseapi.setStatus(404, 'info', 'No existen departamentos registradas')
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());
    } catch (error) {
        httpError(res, error)
    }
};

// METODO PARA CONSULTAR POR ID
export const getDepartment = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_department } = req.params
        const department = await DepartmentModel.findOne({
            where: {
                id_department: id_department,
            },
        });
        if (department) {
            responseapi.setResult(department);
        } else {
            responseapi.setStatus(404, "info", "No existe el departamento solicitado");
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

// METODO CREATE
export const createDepartment = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        // OBTENER LOS DATOS PROPORCIONADOS
        const { name_department } = req.body

        // CONSULTA A LA BD PARA VER SI YA EXISTE UN ROL CON LOS MISMOS DATOS
        const department = await DepartmentModel.findOne({
            attributes: ['name_department'],
            where: {
                name_department: name_department
            }
        });

        if (!department) {
            await DepartmentModel.create({
                name_department
            })
                .then((succes) => {
                    responseapi.setStatus(201, "success", "Departamento creado con exito")
                })
                .catch((error) => {
                    console.error("*** Error crear departamento ****", error)
                    responseapi.setStatus(500, "error", "Error al registrar el departamento")
                })
        } else {
            responseapi.setStatus(409, "info", "Ya existe un departamento con esos datos")
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());
    } catch (error) {
        httpError(res, error)
    }
};

/* METODO UPDATE */
export const updateDepartment = async (req, res) => {
    const responseapi = new ResponseApi();

    try {
        const { id_department } = req.params
        const { name_department } = req.body

        await DepartmentModel.update({
            name_department
        },
            {
                where: {
                    id_department: id_department
                }
            }
        ).then((success) => {
            if (success[0] > 0) {
                responseapi.setStatus(200, "success", "Departamento actualizada correctamente")
            } else {
                responseapi.setStatus(404, "info", "No existe el departamento");
            }
        })
            .catch((err) => {
                console.error("*** Error actualizar departamento ****", err)
                responseapi.setStatus(500, "error", "Error al actualizar el departamento")
            });
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

/* METODO DELETE */
export const deleteDepartment = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_department } = req.params
        await DepartmentModel.destroy({ where: { id_department: id_department } })
            .then((succes) => {
                if (succes > 0) {
                    responseapi.setStatus(200, "success", "Departamento eliminado correctamente")
                } else {
                    responseapi.setStatus(404, "info", "No existe el departamento solicitado");
                }
            })
            .catch((error) => {
                console.error("*** Error eliminar departamento ****", error)
                responseapi.setStatus(500, "error", "Error al eliminar el departamento")
            })
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};