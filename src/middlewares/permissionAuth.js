import { verifyToken } from "../utils/generateToken.js";
import { httpError } from "../utils/handleError.js";
import HPermission from "../model/hasPermissionModel.js";
import Permission from "../model/PermissionModel.js";
import { RelationsModel } from "../model/RelationsModel.js";
import Responseapi from "../utils/responseapi.js";

export const checkPermissionAuth = (permiso) => async (req, res, next) => {
    const responseapi = new Responseapi();
    try {
        const token = req.headers.authorization.split(" ").pop(); // OBTENER EL TOKEN DEL FRONT-END
        console.log("Token ****", token);
        const tokenData = await verifyToken(token); // VERFICAR LA AUNTENTICIDAD DEL TOKEN

        const permissions = await HPermission.findAll({
            //CONSULTAR TODOS LOS PERMISOS DE ESE ROL
            attributes: [],
            where: { fk_role_id: tokenData.role },
            include: [
                {
                    model: Permission,
                    attributes: ["name_permission"],
                },
            ],
        });

        // EXTRAER LOS PERMISOS QUE TIENE ESE ROL
        const nombresPermisos = permissions.map(
            (objet) => objet.PermissionModel.name_permission
        );

        let permission = null;
        for (let a = 0; a < nombresPermisos.length; a++) {
            if (permiso == nombresPermisos[a]) {
                permission = nombresPermisos[a];
                a = nombresPermisos.length - 1; // CUANDO ENCUENTRE ALGO IGUAL SE ASIGNA EL VALOR PARA QUE YA NO SE EJECUTE MAS
            }
        }

        if ([].concat(permiso).includes(permission)) {
            next();
        } else {
            // ENVIAR RESPUESTA DE QUE NO PUEDE ACCEDER POR FALTA DE PERMISOS
            responseapi.setStatus(403, "info", "No tienes los permisos necesarios para acceder");
            // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
            res.json(responseapi.toResponse());
        }
    } catch (error) {
        // console.log(error)
        httpError(res, error);
    }
};
