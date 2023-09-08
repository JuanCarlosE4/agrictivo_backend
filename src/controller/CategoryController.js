import CategoryModel from '../model/CategoryModel.js';
import SystemModel from '../model/SystemModel.js';
import { RelationsModel } from '../model/RelationsModel.js';
import ResponseApi from '../utils/responseapi.js';
// ERROR PARA EL CATCH
import { httpError } from '../utils/handleError.js';
import multer from 'multer';
import path, { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// METODO PARA LISTAR TODAS LAS CATEGORIAS
export const allCategory = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        // CONSULTAR A LA BD TODOS LAS CATEGORIAS
        const categories = await CategoryModel.findAll({
            include: [{
                model: SystemModel,
                attributes: ['name_system']
            }]
        })
        // SI EXISTE POR LO MENOS UNO
        if (categories.length > 0) {
            responseapi.setResult(categories)
            // SI NO EXISTE LA RESPUESTAAPI TOMA LOS VALORES
        } else {
            responseapi.setStatus(404, 'info', 'No existen categorias registradas')
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

// METODO PARA CONSULTAR POR ID
export const getCategory = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_category } = req.params
        const category = await CategoryModel.findOne({
            where: {
                id_category: id_category,
            },
        });
        if (category) {
            responseapi.setResult(category);
        } else {
            responseapi.setStatus(404, "info", "No existe la categoria solicitada");
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

// METODO PARA CONSULTAR POR ID
export const userCategory = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_system } = req.params;
        const category = await CategoryModel.findAll({
            where: { fk_system_id: id_system },
        });
        if (category.length > 0) {
            responseapi.setResult(category);
        } else {
            responseapi.setStatus(404, "info", "No existe la categoria solicitada");
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

// METODO CREATE
// METODO PARA SUBIR LA IMG AL PROYECTO
const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const storage = multer.diskStorage({
    // UBICACION DONDE SE GUARDAN LAS IMG
    destination: join(CURRENT_DIR, '../public/app/category'),
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
});

export const uploadCategory = multer({ storage: storage }).single('img_category');


// GUARDAR LOS DATOS
export const createCategory = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        // OBTENER LOS DATOS PROPORCIONADOS
        const img_category = req.file.filename;
        const { name_category, fk_system_id } = req.body

        // CONSULTA A LA BD PARA VER SI YA EXISTE UN ROL CON LOS MISMOS DATOS
        const category = await CategoryModel.findOne({
            attributes: ['name_category'],
            where: {
                name_category: name_category
            }
        });
        if (category) {
            responseapi.setStatus(409, "info", "Ya existe una categoria con esos datos")
        } else {
            await CategoryModel.create({
                img_category, name_category, fk_system_id
            })
                .then((succes) => {
                    responseapi.setStatus(201, "success", "Nueva categoria registrada correctamente")
                })
                .catch((error) => {
                    console.error("*** Error crear categoria ****", error)
                    responseapi.setStatus(500, "error", "Error al registrar la categoria")
                })
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

/* METODO UPDATE */
export const updateCategory = async (req, res) => {
    const responseapi = new ResponseApi();

    try {
        const { id_category } = req.params;
        const { name_category, fk_system_id } = req.body;

        // CONSULTA A LA BD PARA VER SI YA EXISTE UN ROL CON LOS MISMOS DATOS
        const category = await CategoryModel.findOne({
            attributes: ['name_category'],
            where: {
                id_category: id_category
            }
        });

        if (category) {
            if (!req.file) {
                await CategoryModel.update({
                    name_category, fk_system_id
                },
                    {
                        where: {
                            id_category: id_category
                        }
                    }
                ).then((success) => {
                    responseapi.setStatus(200, "success", "Categoria actualizada correctamente")
                })
                    .catch((error) => {
                        console.error("*** Error actualizar categoria ****", error)
                        responseapi.setStatus(500, "error", "Error al actualizar la categoria")
                    });

            } else {
                // OBTENER EL NOMBRE DE LA NUEVA IMAGEN
                const img_category = req.file.filename;

                /* 1 ELIMINAR LA ANTERIOR IMAGEN GUARDADA EN EL REGISTRO */
                // CONSULTA PARA OBTENER EL NOMBRE DE LA IMAGEN ANTERIOR
                const category = await CategoryModel.findOne({
                    attributes: ['img_category'],
                    where: { id_category: id_category }
                })

                // OBTENER EL NOMBRE DE LA CONSULTA CON EL QUE SE GUARDO LA ANTERIOR VEZ
                const nameimg = category.img_category;

                // ELIMINAR LA IMAGEN DE SERVIDOR
                fs.unlink(path.join(CURRENT_DIR, `../public/app/category/${nameimg}`), (err) => {
                    if (err) {
                        console.error(err)
                    }
                })

                /* 2 GUARDAR LOS NUEVOS CAMBIOS EN LA BD */
                await CategoryModel.update({
                    img_category, name_category, fk_system_id
                },
                    {
                        where: {
                            id_category: id_category
                        }
                    }
                ).then((success) => {
                    responseapi.setStatus(200, "success", "Categoria actualizada correctamente")
                })
                    .catch((err) => {
                        responseapi.setStatus(500, "error", "Error al actualizar la categoria")
                    });
            }
        } else {
            // OBTENER EL NOMBRE DE LA CONSULTA CON EL QUE SE GUARDO LA ANTERIOR VEZ
            const nameimg = req.file.filename;
            // ELIMINAR LA IMAGEN DE SERVIDOR
            fs.unlink(path.join(CURRENT_DIR, `../public/app/category/${nameimg}`), (err) => {
                if (err) {
                    console.error(err)
                }
            })
            responseapi.setStatus(404, "info", "No existe la categoria solicitada");
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

/* METODO DELETE */
export const deleteCategory = async (req, res) => {
    const responseapi = new ResponseApi();
    try {

        const { id_category } = req.params
        // CONSULTA PARA OBTENER EL NOMBRE DE LA IMAGEN
        const category = await CategoryModel.findOne({
            attributes: ['img_category'],
            where: { id_category: id_category }
        })

        if (category) {
            const nameimg = category.img_category;
            // 1 QUE SE ELIMINE DE LA BD
            await CategoryModel.destroy({ where: { id_category: id_category } })
                .then((succes) => {
                    if (succes > 0) {
                        // 2 QUE SE ELIMINE DEL SERVIDOR
                        fs.unlink(path.join(CURRENT_DIR, `../public/app/category/${nameimg}`), (err) => {
                            if (err) {
                                console.error("*** Error eliminar img categoria ****", err)
                            }
                        })
                        responseapi.setStatus(200, "success", "Categoria eliminada correctamente")
                    }
                })
                .catch((error) => {
                    console.error("*** Error eliminar categoria ****", error)
                    responseapi.setStatus(500, "error", "Error al eliminar la categoria")
                })
        } else {
            responseapi.setStatus(404, "info", "No existe la categoria solicitada");
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};