import { verifyToken } from '../utils/generateToken.js';
import { httpError } from '../utils/handleError.js';
import UserModel from '../model/UserModel.js';
import Responseapi from '../utils/responseapi.js';

export const checkRoleAuth = (roles) => async (req, res, next) => {
    const responseapi = new Responseapi();
    try {
        // OBTENER EL TOKEN DEL FRONT-END
        const token = req.headers.authorization.split(' ').pop()
        // VERFICAR LA AUNTENTICIDAD DEL TOKEN
        const tokenData = await verifyToken(token)
        // const permission = await
        const userData = await UserModel.findByPk(tokenData._id)

        if ([].concat(roles).includes(userData.fk_role_id)) {
            next()
        } else {
            // ENVIAR RESPUESTA DE QUE NO PUEDE ACCEDER POR FALTA DE PERMISOS
            responseapi.setStatus(403, 'info', 'No tienes los permisos necesarios para acceder')
            // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
            res.json(responseapi.toResponse());
        }
    } catch (error) {
        console.log("Auth Role: ", error)
        httpError(res, error)
    }
};