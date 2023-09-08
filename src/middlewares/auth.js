import { verifyToken } from "../utils/generateToken.js";
import { httpError } from "../utils/handleError.js";
import ResponseApi from "../utils/responseapi.js";

export const checkAuth = async (req, res, next) => {
  const responseapi = new ResponseApi();
  try {
    if (!req.headers.authorization) {
      responseapi.setStatus(403, "error", "No se detecta el token");
      res.json(responseapi.toResponse());
    } else {
      const token = req.headers.authorization.split(" ").pop(); // EXTRAER EL TOKEN.
      const tokenData = await verifyToken(token); //  VERIFICAR TOKEN

      if (!tokenData) {
        responseapi.setStatus(401, "error", "Su inicio de sesión es invalido. Por favor vuelva a iniciar");
        res.json(responseapi.toResponse());
      } else {
        req.userId = tokenData._id;
        next();
      }
    }
  } catch (error) {
    httpError(res, error);
  }
};
