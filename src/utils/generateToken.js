// IMPORTAR JSONWEBTOKEN
import jwt from "jsonwebtoken";

// GENERAR TOKEN
export const tokenSing = async (user, checked) => {
  if (!checked) {
    console.log("**** Token vence ****")
    const token = jwt.sign(
      {
        _id: user.id_user,
        role: user.fk_role_id,
      },
      // ASIGNAR UNA LLAVE UNICA DEL APLICATIVO

      process.env.JWT_SECRET,
      {
        // TIEMPO EN QUE EXPIRA EL TOKEN
        expiresIn: "2h",
      }
    );
    return token;
  } else {
    console.log("**** Token no vence ****")
    const token = jwt.sign(
      {
        _id: user.id_user,
        role: user.fk_role_id,
      },
      // ASIGNAR UNA LLAVE UNICA DEL APLICATIVO
      process.env.JWT_SECRET,
    );
    return token;
  }
};

// VERIFICAR TOKEN
export const verifyToken = async (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// VERIFICAR QUE EL TOKEN SEA VALIDO
export const decodeSing = (token) => {
  return jwt.decode(token, null);
};
