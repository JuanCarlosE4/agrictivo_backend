import SubcategoryModel from '../model/SubcategoryModel.js';
import CategoryModel from '../model/CategoryModel.js';
import TUnitModel from '../model/TUnitModel.js'
import { RelationsModel } from '../model/RelationsModel.js';
import ResponseApi from '../utils/responseapi.js';
// ERROR PARA EL CATCH
import { httpError } from '../utils/handleError.js';
import multer from 'multer';
import path, { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { Sequelize } from 'sequelize';

// METODO PARA LISTAR TODAS LAS SUBCATEGORIAS
export const allSubcategory = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        // CONSULTAR A LA BD TODAS LAS SUBCATEGORIAS
        const subcategories = await SubcategoryModel.findAll({
            include: [{
                model: CategoryModel,
                attributes: ['name_category']
            },
            {
                model: TUnitModel,
                attributes: ["name_tunit"]
            }
            ]
        })
        // SI EXISTE POR LO MENOS UNO
        if (subcategories.length > 0) {
            responseapi.setResult(subcategories)
            // SI NO EXISTE LA RESPUESTAAPI TOMA LOS VALORES
        } else {
            responseapi.setStatus(404, 'info', 'No existen subcategorias registradas')
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

// METODO PARA CONSULTAR POR ID
export const getSubcategory = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_subcategory } = req.params
        const subcategory = await SubcategoryModel.findOne({
            where: {
                id_subcategory: id_subcategory,
            },
        });
        if (subcategory) {
            responseapi.setResult(subcategory);
        } else {
            responseapi.setStatus(404, "info", "No existe la subcategoria solicitada");
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

// METODO PARA CONSULTAR POR ID
export const userSubcategory = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_category } = req.params
        const subcategory = await SubcategoryModel.findAll({
            where: { fk_category_id: id_category },
        });
        if (subcategory.length > 0) {
            responseapi.setResult(subcategory);
        } else {
            responseapi.setStatus(404, "info", "No existe la subcategoria solicitada");
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
    destination: join(CURRENT_DIR, '../public/app/subcategory'),
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
});
export const uploadSubcategory = multer({ storage: storage }).single('img_subcategory');

// GUARDAR LOS DATOS
export const createSubcategory = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        // OBTENER LOS DATOS PROPORCIONADOS
        const img_subcategory = req.file.filename;
        const { name_subcategory, duration_subcategory, fk_tunit_id, fk_category_id } = req.body

        // CONSULTA A LA BD PARA VER SI YA EXISTE UN ROL CON LOS MISMOS DATOS
        const subcategory = await SubcategoryModel.findOne({
            attributes: ['name_subcategory'],
            where: {
                [Sequelize.Op.and]: [
                    { name_subcategory: name_subcategory }, { fk_category_id: fk_category_id }
                ]
            }
        });
        if (subcategory) {
            responseapi.setStatus(409, "info", "Ya existe una subcategoria con esos datos")
        } else {
            await SubcategoryModel.create({
                img_subcategory, name_subcategory, duration_subcategory, fk_tunit_id, fk_category_id
            })
                .then((succes) => {
                    responseapi.setStatus(201, "success", "Nueva Sub-categoria registrada correctamente")
                })
                .catch((error) => {
                    console.error("*** Error crear subcategoria ****", error)
                    responseapi.setStatus(500, "error", "Error al registrar la Sub-categoria")
                })
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

/* METODO UPDATE */
export const updateSubcategory = async (req, res) => {
    const responseapi = new ResponseApi();

    try {
        const { id_subcategory } = req.params
        const { name_subcategory, duration_subcategory, fk_tunit_id, fk_category_id } = req.body
        // CONSULTA A LA BD PARA VER SI YA EXISTE UN ROL CON LOS MISMOS DATOS
        const subcategory = await SubcategoryModel.findOne({
            attributes: ['name_subcategory'],
            where: {
                id_subcategory: id_subcategory
            }
        });

        if (subcategory) {
            if (!req.file) {
                await SubcategoryModel.update({
                    name_subcategory, duration_subcategory, fk_tunit_id, fk_category_id
                },
                    {
                        where: {
                            id_subcategory: id_subcategory
                        }
                    }
                ).then((success) => {
                    responseapi.setStatus(200, "success", "Sub-Categoria actualizada correctamente")
                })
                    .catch((err) => {
                        console.error("*** Error actualizar subcategoria ****", error)
                        responseapi.setStatus(500, "error", "Error al actualizar la sub-categoria")
                    });

            } else {
                // OBTENER EL NOMBRE DE LA NUEVA IMAGEN
                const img_subcategory = req.file.filename;

                /* 1 ELIMINAR LA ANTERIOR IMAGEN GUARDADA EN EL REGISTRO */
                // CONSULTA PARA OBTENER EL NOMBRE DE LA IMAGEN ANTERIOR
                const subcategory = await SubcategoryModel.findOne({
                    attributes: ['img_subcategory'],
                    where: { id_subcategory: id_subcategory }
                })

                // OBTENER EL NOMBRE DE LA CONSULTA CON EL QUE SE GUARDO LA ANTERIOR VEZ
                const nameimg = subcategory.img_subcategory;

                // ELIMINAR LA IMAGEN DE SERVIDOR
                fs.unlink(path.join(CURRENT_DIR, `../public/app/subcategory/${nameimg}`), (err) => {
                    if (err) {
                        console.error(err)
                    }
                })

                /* 2 GUARDAR LOS NUEVOS CAMBIOS EN LA BD */
                await SubcategoryModel.update({
                    img_subcategory, name_subcategory, duration_subcategory, fk_category_id
                },
                    {
                        where: {
                            id_subcategory: id_subcategory
                        }
                    }
                ).then((success) => {
                    responseapi.setStatus(200, "success", "Sub-Categoria actualizada correctamente")
                })
                    .catch((err) => {
                        responseapi.setStatus(500, "error", "Error al actualizar la sub-categoria")
                    });
            }
        } else {
            // OBTENER EL NOMBRE DE LA CONSULTA CON EL QUE SE GUARDO LA ANTERIOR VEZ
            const nameimg = req.file.filename;
            // ELIMINAR LA IMAGEN DE SERVIDOR
            fs.unlink(path.join(CURRENT_DIR, `../public/app/subcategory/${nameimg}`), (err) => {
                if (err) {
                    console.error(err)
                }
            })
            responseapi.setStatus(404, "info", "No existe la sub-categoria solicitada");
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

/* METODO DELETE */
export const deleteSubcategory = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_subcategory } = req.params

        // CONSULTA PARA OBTENER EL NOMBRE DE LA IMAGEN
        const subcategory = await SubcategoryModel.findOne({
            attributes: ['img_subcategory'],
            where: { id_subcategory: id_subcategory }
        })

        if (subcategory) {
            const nameimg = subcategory.img_subcategory;
            // 1 QUE SE ELIMINE DE LA BD
            await SubcategoryModel.destroy({ where: { id_subcategory: id_subcategory } })
                .then((succes) => {
                    if (succes > 0) {
                        // 2 QUE SE ELIMINE DEL SERVIDOR
                        fs.unlink(path.join(CURRENT_DIR, `../public/app/subcategory/${nameimg}`), (err) => {
                            if (err) {
                                console.error(err)
                            }
                        })
                        responseapi.setStatus(200, "success", "Sub-Categoria eliminada correctamente")
                    }
                })
                .catch((error) => {
                    console.error("*** Error eliminar subcategoria ****", error)
                    responseapi.setStatus(500, "error", "Error al eliminar la sub-categoria")
                })
        } else {
            responseapi.setStatus(404, "info", "No existe la sub-categoria solicitada");
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};