import HPermissionModel from "../model/hasPermissionModel.js";
import PermissionModel from "../model/PermissionModel.js";
import RoleModel from "../model/RoleModel.js";
import ResponseApi from "../utils/responseapi.js";
// ERROR PARA EL CATCH
import { httpError } from "../utils/handleError.js";
import { RelationsModel } from "../model/RelationsModel.js";
import { Sequelize } from "sequelize";

/* ALL */
export const allHPermission = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const hpermissions = await HPermissionModel.findAll({
            attributes: ['id_hpermission'],
            include: [
                {
                    model: PermissionModel,
                    attributes: ["id_permission", "name_permission"],
                },
                {
                    model: RoleModel,
                    attributes: ["id_role", "name_role"],
                },
            ],
        });

        if (hpermissions.length > 0) {
            responseapi.setResult(hpermissions);
        } else {
            responseapi.setStatus(404, "info", "No existen permisos asignados");
        }
        // RESPUESTA
        res.json(responseapi.toResponse());
    } catch (error) {
        // ERROR DEL SERVIDOR
        httpError(res, error);
    }
};

// GET ID
export const getHPermission = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        // OBTENER EL ID
        const { id_hpermission } = req.params;
        // REALIZAR LA CONSULTA
        const hpermission = await HPermissionModel.findOne({
            where: { id_hpermission: id_hpermission },
        });
        // CONDICION DEL RESULTADO DE LA CONSULTA
        if (hpermission) {
            // REGISTRO ENCONTRADO
            responseapi.setResult(hpermission);
            // res.json(responseapi.toResponse())
        } else {
            // NO ENCONTRO NADA
            responseapi.setStatus(404, "info", "No existe el permiso asignado");
            // res.json(responseapi.toResponse())
        }
        // RESPUESTA
        res.json(responseapi.toResponse());
    } catch (error) {
        httpError(res, error);
    }
};

/* CONSULTAR SI YA EXISTEN LA MISMA ASIGNACION DE PERMISO  */
const searchHPermission = async (fk_role_id, fk_permission_id) => {
    const hpermission = await HPermissionModel.findOne({
        where: {
            [Sequelize.Op.and]: [
                { fk_role_id: fk_role_id },
                { fk_permission_id: fk_permission_id },
            ],
        },
    });
    return hpermission;
};

/* CREATE */
export const createHPermission = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { fk_role_id, fk_permission_id } = req.body;

        // FUNCION PARA REALIZAR LA CONSULTA
        const hpermission = await searchHPermission(fk_role_id, fk_permission_id);

        if (!hpermission) {
            await HPermissionModel.create({
                fk_role_id,
                fk_permission_id,
            })
                .then((success) => {
                    responseapi.setStatus(201, "success", "Asignacion de Permiso creado con exito");
                })
                .catch((error) => {
                    console.error("*** Error asignar permiso ****", error)
                    responseapi.setStatus(500, "error", "Error al registrar la asignacion del permiso");
                });
        } else {
            // YA EXISTE UN REGISTRO CON ESOS DATOS
            responseapi.setStatus(409, "info", "Ya existe una asignacion de permiso con esos datos");
        }
        res.json(responseapi.toResponse());
    } catch (error) {
        // ERROR DEL SERVIDOR
        httpError(res, error);
    }
};

/* UPDATE */
export const updateHPermission = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_hpermission } = req.params; // OBTENER EL ID DEL REGISTRO
        const { fk_role_id, fk_permission_id } = req.body; // OBTENER LOS DATOS A ACTUALIZAR
        const hpermission = await searchHPermission(fk_role_id, fk_permission_id);

        if (!hpermission) {
            await HPermissionModel.update(
                {
                    // ACUTALIZAR LOS DATOS
                    fk_role_id,
                    fk_permission_id,
                },
                {
                    where: { id_hpermission: id_hpermission },
                }
            )
                .then((success) => {
                    if (success[0] > 0) {
                        // SI SE ACTUALIZA
                        responseapi.setStatus(200, "success", "Asignacion de permiso actualizado correctamente");
                    } else {
                        // NO SE ACTUALIZA
                        responseapi.setStatus(404, "info", "No existe la asignacion de permiso solicitada");
                    }
                })
                .catch((error) => {
                    // ERROR AL ACTUALIZAR
                    console.error("*** Error actualizar asignacion permiso ****", error)
                    responseapi.setStatus(500, "error", "Error al actualizar la asignacion del permiso");
                });
        } else {
            // YA EXISTE UN REGISTRO CON ESOS DATOS
            responseapi.setStatus(409, "info", "Ya existe una asignacion de permiso con esos datos");
        }
        // RESPUESTA
        res.json(responseapi.toResponse());
    } catch (error) {
        httpError(res, error); // ERROR DEL SERVIDOR
    }
};

/* DELETE */
export const deleteHPermission = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_hpermission } = req.params //RECIBIR EL ID DEL REGISTRO A BORRAR
        // ELIMINAR EL REGISTRO
        await HPermissionModel.destroy({ where: { id_hpermission: id_hpermission } })
            .then((success) => {
                if (success > 0) { // ELIMINADO
                    responseapi.setStatus(200, 'success', 'Asignacion del permiso eliminada correctamente');
                } else { // NO EXISTE EL REGISTRO
                    responseapi.setStatus(404, "info", "No existe la asignacion del permiso solicitado");
                }
            }).catch((error) => { // ERROR AL ELIMINAR EL REGISTRO
                console.error("*** Error eliminar asignación de permiso ****", error)
                responseapi.setStatus(500, "error", "Error al eliminar la asignacion del permiso");
            })
        res.json(responseapi.toResponse()) // RESPUESTA DEL SERVIDOR
    } catch (error) {
        httpError(res, error) // ERROR DEL SERVIDOR
    }
};