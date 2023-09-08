import { httpError } from '../utils/handleError.js'; // ERROR PARA EL CATCH
import { tokenSing, verifyToken } from '../utils/generateToken.js'; // CREAR TOKEN
import { encrypt, compare } from '../utils/gereteHash.js'; // BCRYPT
import UserModel from '../model/UserModel.js'; // MODELO USER
import { Sequelize } from 'sequelize';
import ResponseApi from '../utils/responseapi.js'; // ESTRUCTUA PARA LA RESPUESTA DE LA API
import nodemailer from 'nodemailer'; // GENERAR EMAIL
import { RelationsModel } from '../model/RelationsModel.js';

/* FUNCION CREATE */
export const createUser = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { cedula_user, name_user, email_user, password_user, celular1, celular2 } = req.body // OBTENER LOS DATOS PROPORCIONADOS
        const fk_role_id = 1; // ASIGNAR EL ROL POR DEFECTO PARA PRUEBAS NO LOGIN
        // CONSULTA A LA BD PARA VER SI YA EXISTE UN USUARIO CON LOS MISMOS DATOS CEDULA O EMAIL
        const user = await UserModel.findOne({
            attributes: ['cedula_user', 'email_user'],
            where: {
                [Sequelize.Op.or]: [
                    { cedula_user: cedula_user },
                    { email_user: email_user }
                ]
            }
        });
        // Verificar si el usuario ya existe en la base de datos
        if (!user) {
            // ENCRIPTAR LA CONTRASEÑA
            const password = await encrypt(password_user)
            // GUARDAR LOS DATOS
            await UserModel.create({
                cedula_user, name_user, email_user, password, celular1, celular2, fk_role_id
            })
                .then((succes) => {
                    responseapi.setStatus(201, "success", "Usuario creado correctamente")
                })
                .catch((error) => {
                    console.error("*** Error crear usuario ****", error)
                    responseapi.setStatus(500, 'error', 'Error al registrar al usuario')
                })
        } else {
            responseapi.setStatus(409, "info", "Ya existe un usuario con los mismos datos")
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());
    } catch (error) {
        httpError(res, error)
    }
};

/* FUNCION LOGIN */
export const loginUser = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { cedula_user, password, checked } = req.body;
        // Verificar si el usuario existe en la base de datos
        const user = await UserModel.findOne({
            attributes: ['id_user', 'name_user', 'cedula_user', 'password', 'fk_role_id'],
            where: {
                cedula_user: cedula_user,
            },
        })
        // NO EXISTE EL USUARIO
        if (!user) {
            responseapi.setStatus(406, 'info', 'Credenciales de cedula inválidas')
            // SI EXISTE
        } else {
            // VERIFICAR SI LA CONTRASEÑA ES CORRECTA
            const user_password = user.password
            const checkPassword = await compare(password, user_password)

            // SI NO ES CORRECTO RETORNA ERROR
            if (!checkPassword) {
                responseapi.setStatus(400, 'info', 'Credenciales de password inválidas')
            } else {
                // CREAR TOKEN
                const tokenSession = await tokenSing(user, checked)
                responseapi.setStatus(200, "success", `Bienvenid@ ${user.name_user}`)
                responseapi.setResult(tokenSession)
            }
        }
        res.json(responseapi.toResponse())
    } catch (error) {
        httpError(res, error)
    }
}

/* FUNCION FORGOT PASSWORD */
export const forgotPasswort = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { email_user } = req.body

        // VERIFICAR QUE EL CORREO ESTE REGISTRADO CON EL USUARIO
        const user = await UserModel.findOne({
            attributes: ['id_user', 'email_user', 'fk_role_id'],
            where: {
                email_user: email_user,
            }
        })

        if (user) {
            // CREAR TOKEN
            const tokenPassword = await tokenSing(user)

            // CONFIGURAR NODEMAILER
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                // PRODUCCION
                secure: true,
                auth: {
                    user: 'comercaucage@gmail.com', // Cambia esto por tu dirección de correo electrónico desde donde se envia el manseje
                    pass: 'fkpjpdwwqjqoydoy', // Cambia esto por tu contraseña del correo
                },
                // DESARROLLO
                // tls: {
                //     rejectUnauthorized: false // Agrega esta opción para permitir certificados autofirmados en desarrollo
                // }
            });

            // TRAER LA RUTA DEL FRONTEND DEL .ENV
            const ruta = process.env.FRONTED_VUE;

            // ASIGNAR EL MENSAJE
            const mailOptions = {
                from: 'comercaucage@gmail.com',
                to: user.email_user,
                subject: 'Restablecer contraseña Agrictivo',
                // html body
                html: `
                <b>Haz clic para</b>
                <a href="${ruta}/reset-password/${tokenPassword}">aquí</a>
                <b>restablecer tu contraseña</b>`,
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("*** Error enviar email ****", error)
                    responseapi.setStatus(500, 'error', 'Error al enviar el correo electrónico')
                    res.json(responseapi.toResponse())
                } else {
                    responseapi.setStatus(200, "success", "Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña")
                    res.json(responseapi.toResponse())
                }
            })
        } else {
            responseapi.setStatus(404, "info", "El correo que especifico, no se encuentra registrado")
            res.json(responseapi.toResponse())
        }
    } catch (error) {
        httpError(res, error)
    }
};

/* RESTABLECER LA CONTRASEÑA */
export const resetPassword = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { password_user, token } = req.body

        // VERFICAR SI EL TOKEN PARA RESTABLECER CONTRASEÑA ES VALIDO O NO
        const resToken = await verifyToken(token)

        if (resToken === null) {
            responseapi.setStatus(406, 'info', 'El permiso caduco o es invalido. ¡Por favor realize la petición de nuevo!')
        } else {
            responseapi.setStatus(200, 'success', 'Su contraseña se actualizo correctamente')
            //  HASHEAR LA CONTRASEÑA
            const password = await encrypt(password_user)

            const id_user = resToken._id
            // GUARDAR LA NUEVA CONTRASEÑA
            await UserModel.update({
                password
            },
                {
                    where: {
                        id_user: id_user
                    }
                }
            ).then((success) => {
                if (success[0] > 0) {
                    responseapi.setStatus(200, "success", "Contraseña actualizada correctamente")
                } else {
                    responseapi.setStatus(404, "info", "No existe el usuario solicitado");
                }
            })
                .catch((err) => {
                    console.error("*** Error actualizar contraseña ****", err)
                    responseapi.setStatus(500, "error", "Error al actualizar la contraseña")
                });
        }
        res.json(responseapi.toResponse())
    } catch (error) {
        httpError(res, error)
    }
};