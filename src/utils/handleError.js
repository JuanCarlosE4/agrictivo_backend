import ResponseApi from "./responseapi.js";

// FUNCION PARA CUANDO OCURRA UN ERROR CON EL SERVIDOR
export const httpError = (res, err) => {
    console.log("*** Error servidor ****", err)
    const responseapi = new ResponseApi();
    responseapi.setStatus(500, "error", "Algo salió mal, inténtalo más tarde");
    res.json(responseapi.toResponse());
};