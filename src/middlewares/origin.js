import Responseapi from '../utils/responseapi.js';
import { httpError } from '../utils/handleError.js';

export const checkOrigin = (req, res, next) => {
    const responseapi = new Responseapi();
    try {
        //
        const token = req.header.authorization.split(' ').pop()
        // VERIFICAR QUE EL TOKEN SEA AUTENTICO DEL APP
        if (token === 'JuanE%4') {
            next()
        } else {
            // ENVIAR RESPUESTA DE QUE NO PUEDE ACCEDER POR FALTA DE PERMISOS
            responseapi.setStatus(403, 'info', 'No tienes los permisos necesarios para acceder')
            res.json(responseapi.setResult())
        }
    } catch (error) {
        httpError(error)
    }
};