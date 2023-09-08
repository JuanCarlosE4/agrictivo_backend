// IMPORTAR EL MODELO
import PermissionM from '../model/PermissionModel.js'
// ERROR SERVIDOR
import { httpError } from '../utils/handleError.js'
// ESTRUCTUA API
import responseApi from '../utils/responseapi.js'

// LISTAR TODO
export const allPermission = async (req, res) => {
    const responseapi = new responseApi();
    try {
        // CONSULTAR TODOS LOS PERMISOS
        const permissions = await PermissionM.findAll()
        // SI EXISTE MAS DE UN REGISTRO
        if (permissions.length > 0) {
            responseapi.setResult(permissions)
            // NO HAY REGISTROS
        } else {
            responseapi.setStatus(404, 'info', 'No existen permisos registrados')
        }
        // RESPUESTA
        res.json(responseapi.toResponse())
    } catch (error) {
        // ERROR DE SERVIDOR
        httpError(res, error)
    }
};

// GET ID
export const getPermission = async (req, res) => {
    const responseapi = new responseApi()
    try {
        // OBTENER EL ID
        const { id_permission } = req.params
        // CONSULTAR EL PERMISO
        const permission = await PermissionM.findOne({
            where: {
                id_permission: id_permission
            }
        })

        // CONDICION DE RESULTADO
        if (permission) {
            responseapi.setResult(permission)
        } else {
            responseapi.setStatus(404, "info", "No existe el permiso solicitado")
        }
        res.json(responseapi.toResponse())
    } catch (error) {
        httpError(res, error)
    }
};

export const createPermission = async (req, res) => {
    const responseapi = new responseApi()
    try {
        const { name_permission } = req.body
        // BUSCAR UN PERMISO CON EL MISMO NOMBRE
        const permission = await PermissionM.findOne({ where: { name_permission: name_permission } })
        // CONDICION DE LA CONSULTA
        if (!permission) {
            await PermissionM.create({
                name_permission
            }).then((success) => {
                // REGISTRADO CON EXITO
                responseapi.setStatus(201, 'success', 'Permiso creado con exito')
            }).catch((error) => {
                // ERROR AL REGISTRAR
                console.error("*** Error crear permiso ****", error)
                responseapi.setStatus(500, 'error', 'Error al registrar el permiso')
            })
        } else {
            // YA EXISTE UN REGISTRO CON ESOS DATOS
            responseapi.setStatus(409, 'info', 'Ya existe un permiso con esos datos')
        }
        res.json(responseapi.toResponse())
    } catch (error) {
        httpError(res, error)
    }
};

/* ACTUALIZAR */
export const updatePermission = async (req, res) => {
    const responseapi = new responseApi()
    try {
        const { id_permission } = req.params
        const { name_permission } = req.body
        // ACTUALIZAR DATOS
        await PermissionM.update({ name_permission }, { where: { id_permission: id_permission } })
            .then((success) => {
                if (success[0] > 0) {
                    responseapi.setStatus(200, 'success', 'Permiso actualizado correctamente');
                } else {
                    responseapi.setStatus(404, "info", "No existe el permiso solicitado");
                }
            }).catch((error) => {
                console.error("*** Error actualizar permiso ****", error)
                responseapi.setStatus(500, 'error', 'Error al actualizar el permiso');
            });
        res.json(responseapi.toResponse());
    } catch (error) {
        httpError(res, error)
    }
};

/* ELIMINAR */
export const deletePermission = async (req, res) => {
    const responseapi = new responseApi()
    try {
        const { id_permission } = req.params
        // ELIMINAR EL REGISTRO
        await PermissionM.destroy({ where: { id_permission: id_permission } })
            .then((success) => {
                if (success > 0) {
                    responseapi.set - Status(200, 'success', 'Permiso eliminado correctamente');
                } else {
                    responseapi.setStatus(404, "info", "No existe el permiso solicitado");
                }
            }).catch((error) => {
                console.error("*** Error eliminar permiso ****", error)
                responseapi.setStatus(500, "error", "Error al eliminar el permiso");
            })
        res.json(responseapi.toResponse())
    } catch (error) {
        httpError(res, error)
    }
};