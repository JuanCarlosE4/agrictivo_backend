import RoleModel from '../model/RoleModel.js';
import ResponseApi from '../utils/responseapi.js';
// ERROR PARA EL CATCH
import { httpError } from '../utils/handleError.js';

// METODO PARA LISTAR TODOS LOS ROLES
export const allRole = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        // CONSULTAR A LA BD TODOS LOS ROLES
        const roles = await RoleModel.findAll()
        // SI EXISTE POR LO MENOS UNO
        if (roles.length > 0) {
            responseapi.setResult(roles)
            // SI NO EXISTE LA RESPUESTAAPI TOMA LOS VALORES
        } else {
            responseapi.setStatus(404, 'info', 'No existen roles registrados')
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());
    } catch (error) {
        httpError(res, error)
    }
};

// METODO PARA CONSULTAR POR ID
export const getRole = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_role } = req.params
        const role = await RoleModel.findOne({
            where: {
                id_role: id_role,
            },
        });
        if (role) {
            responseapi.setResult(role);
        } else {
            responseapi.setStatus(404, "info", "No existe el rol solicitado");
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

// METODO CREATE
export const createRole = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        // OBTENER LOS DATOS PROPORCIONADOS
        const { name_role } = req.body

        // CONSULTA A LA BD PARA VER SI YA EXISTE UN ROL CON LOS MISMOS DATOS
        const role = await RoleModel.findOne({
            attributes: ['name_role'],
            where: {
                name_role: name_role
            }
        });

        if (!role) {
            await RoleModel.create({
                name_role
            })
                .then((succes) => {
                    responseapi.setStatus(201, "success", "Rol creado con exito")
                })
                .catch((error) => {
                    console.error("*** Error crear rol ****", error)
                    responseapi.setStatus(500, "error", "Error al registrar el rol")
                })
        } else {
            responseapi.setStatus(409, "info", "Ya existe un rol con esos datos")
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());
    } catch (error) {
        httpError(res, error)
    }
};

/* METODO UPDATE */
export const updateRole = async (req, res) => {
    const responseapi = new ResponseApi();

    try {
        const { id_role } = req.params
        const { name_role } = req.body

        await RoleModel.update({
            name_role
        },
            {
                where: {
                    id_role: id_role
                }
            }
        ).then((success) => {
            if (success[0] > 0) {
                responseapi.setStatus(200, "success", "Rol actualizado correctamente")
            } else {
                responseapi.setStatus(404, "info", "No existe el rol solicitado");
            }
        })
            .catch((err) => {
                console.error("*** Error actualizar rol ****", err)
                responseapi.setStatus(500, "error", "Error al actualizar el rol")
            });
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

/* METODO DELETE */
export const deleteRole = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_role } = req.params
        await RoleModel.destroy({ where: { id_role: id_role } })
            .then((succes) => {
                if (succes > 0) {
                    responseapi.setStatus(200, "success", "Rol eliminado correctamente")
                } else {
                    responseapi.setStatus(404, "info", "No existe el rol solicitado");
                }
            })
            .catch((error) => {
                console.error("*** Error eliminar rol ****", error)
                responseapi.setStatus(500, "error", "Error al eliminar el rol")
            })
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};