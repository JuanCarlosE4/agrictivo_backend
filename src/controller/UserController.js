import UserModel from '../model/UserModel.js';
import RoleModel from '../model/RoleModel.js';
import ResponseApi from '../utils/responseapi.js';
// ERROR PARA EL CATCH
import { httpError } from '../utils/handleError.js';
import { RelationsModel } from '../model/RelationsModel.js';

// METODO PARA LISTAR TODOS LOS USUARIOS
export const allUser = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        // CONSULTA A LA BD PARA TRAER USUARIO CON SU RESPECTIVO ROL
        const users = await UserModel.findAll({
            attributes: ['id_user', 'cedula_user', 'name_user', 'email_user', 'celular1', 'celular2'],
            include: [{
                model: RoleModel,
                attributes: ['name_role']
            }]
        })

        if (users.length > 0) {
            responseapi.setResult(users)
        } else {
            responseapi.setStatus(404, 'info', 'No existen usuarios registrados')
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

// METODO PARA CONSULTAR UN USUARIO POR ID
export const getUser = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_user } = req.params

        const user = await UserModel.findOne({
            attributes: ['id_user', 'cedula_user', 'name_user', 'email_user', 'celular1', 'celular2'],
            include: [{
                model: RoleModel,
                attributes: ['id_role', 'name_role']
            }],
            where: {
                id_user: id_user,
            }
        });
        if (user) {
            responseapi.setResult(user);
        } else {
            responseapi.setStatus(404, "info", "No existe el usuario solicitado");
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

/* METODO UPDATE */
export const updateUser = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_user } = req.params
        const { cedula_user, name_user, email_user, password_user, celular1, celular2, fk_role_id } = req.body

        await UserModel.update({
            cedula_user, name_user, email_user, password_user, celular1, celular2, fk_role_id
        },
            {
                where: {
                    id_user: id_user
                }
            }
        ).then((success) => {
            if (success[0] > 0) {
                responseapi.setStatus(200, "success", "Usuario actualizado correctamente")
            } else {
                responseapi.setStatus(404, "info", "No existe el usuario solicitado");
            }
        })
            .catch((err) => {
                console.error("*** Error actualizar usuario ****", err)
                responseapi.setStatus(500, "error", "Error al actualizar el usuario")
            });
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

/* METODO DELETE */
export const deleteUser = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_user } = req.params
        await UserModel.destroy({ where: { id_user: id_user } })
            .then((succes) => {
                if (succes > 0) {
                    responseapi.setStatus(200, "success", "Usuario eliminado correctamente")
                } else {
                    responseapi.setStatus(404, "info", "No existe el usuario solicitado");
                }
            })
            .catch((error) => {
                console.error("*** Error eliminar tipo sensor ****", error)
                responseapi.setStatus(500, "error", "Error al eliminar el usuario")
            })
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};