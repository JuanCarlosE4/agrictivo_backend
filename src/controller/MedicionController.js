/* MODELOS */
import MedicionModel from '../model/MedicionModel.js';
import AdjuntoModel from '../model/AdjuntoModel.js';
import CultiveModel from '../model/CultiveModel.js';
import FincaModel from '../model/FincaModel.js';
import WUnitModel from '../model/WUnitModel.js'
import MUnitModel from '../model/MUnitModel.js'
import SubcategoryModel from '../model/SubcategoryModel.js';
import CategoryModel from '../model/CategoryModel.js';
import { RelationsModel } from '../model/RelationsModel.js'

import ResponseApi from '../utils/responseapi.js';
// ERROR PARA EL CATCH
import { httpError } from '../utils/handleError.js';
import multer from 'multer';
import path, { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// METODO PARA LISTAR TODAS LAS MEDICIONES
export const allMedicion = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_cultivo } = req.params;
        // CONSULTAR A LA BD TODAS LAS MEDICIONES
        const mediciones = await MedicionModel.findAll({ where: { fk_cultive_id: id_cultivo } })
        // SI EXISTE POR LO MENOS UNO
        if (mediciones.length > 0) {
            responseapi.setResult(mediciones)
            // SI NO EXISTE LA RESPUESTAAPI TOMA LOS VALORES
        } else {
            responseapi.setStatus(404, 'info', 'No existen mediciones registradas')
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

// METODO PARA CONSULTAR POR ID
export const getMedicion = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_medicion } = req.params
        const medicion = await MedicionModel.findOne({
            where: {
                id_medicion: id_medicion,
            },
        });
        if (medicion) {
            responseapi.setResult(medicion);
        } else {
            responseapi.setStatus(404, "info", "No existe la medición solicitada");
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

/* METODO CREATE */
// METODO PARA SUBIR LA IMG AL PROYECTO
const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
// INDICA LOS TIPOS DE ARCHIVO QUE SE PERMITEN
const MIMETYPES = ['image/jpeg', 'image/png'];

const Appmulter = multer({
    storage: multer.diskStorage({
        // UBICACION DONDE SE GUARDAN LAS IMG
        destination: join(CURRENT_DIR, '../public/user/medicion'),
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}_${file.originalname}`)
        }
    }),
    fileFilter: (req, file, cb) => {
        // COMPARA SI EL TIPO DE ARCHIVO ES VALIDO AL ASIGNADO
        if (MIMETYPES.includes(file.mimetype)) cb(null, true)
        else
            // SI NO ES CORRECTO DEVUELVE UN ERROR INDICANDO QUE TIPO DE ARCHIVOS SON LOS CORRECTOS
            cb(new Error(`Only ${MIMETYPES.join(' ')} mimetypes are allowed`));
    },
    // INDICA EL LIMITE DE PESO DE CADA ARCHIVO EN BYTES
    limits: {
        fieldSize: 10000000
    },
});
// /* EXPORTAMOS EL METODO */
// ARRAY INDICA EL NOMBRE DEL ARRAY Y EL NUMERO MAXIMO DE IMG QUE SE PERMITEN
export const uploadMedicion = Appmulter.array('img_medicion', 5);

// GUARDAR LOS DATOS
export const createMedicion = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        // OBTENER LOS DATOS PROPORCIONADOS
        const { promedio_medicion, pspromedio_medicion, fk_wunit_id, talla_medicion, fk_munit_id, desecho, observacion_medicion, fk_cultive_id } = req.body

        const medicion = await MedicionModel.create({ promedio_medicion, pspromedio_medicion, fk_wunit_id, talla_medicion, fk_munit_id, desecho, observacion_medicion, fk_cultive_id })
            .catch((error) => {
                console.error("*** Error crear medición ****", error)
            })
        // SI NO SE REGISTRA LA MEDICION
        if (!medicion) {
            responseapi.setStatus(406, "error", "La medición no se guardo correctamente");
        } else {

            const cultive = await CultiveModel.findOne({
                attributes: ['total_cultive'],
                where: { id_cultive: fk_cultive_id }
            });
            const total_cultive = parseInt(cultive.total_cultive, 10) - desecho; // OPERACION PARA EL NUEVO TOTAL

            CultiveModel.update(
                { total_cultive },
                { where: { id_cultive: fk_cultive_id } }
            )

            // SI NO SE REGISTRAN IMAGENES
            if (!req.files) {
                responseapi.setStatus(201, "success", "Medición registrada correctamente");
            } else {
                // ADQUIRIR EL ID DE LA MEDICION QUE SE REALIZO
                const fk_medicion_id = medicion.id_medicion;
                // ADQUIRIR EL ARREGLO DE IMAGENES
                const imagenes = req.files.map(file => file.filename);
                for (let a = 0; a < imagenes.length; a++) {
                    // ADQUIERE EL VALOR DE ARREGLO POR INDEX
                    let archivo_adjunto = imagenes[a];
                    // IR GUARDANDO EN LA BD LOS NOMBRES DE LAS IMAGENES
                    await AdjuntoModel.create({ archivo_adjunto, fk_medicion_id });
                }
                responseapi.setStatus(201, "success", "Medición y evidencias registradas correctamente");
            }
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

/* METODO UPDATE */
export const updateMedicion = async (req, res) => {
    const responseapi = new ResponseApi();

    const { id_medicion } = req.params;
    const { name_category, fk_system_id } = req.body;

    try {
        if (!req.file) {
        } else {
            const img_category = req.file.filename;
            const medicion = await AdjuntoModel.findOne({
                attributes: ['archivo_adjunto'],
                where: {
                    fk_medicion_id: id_medicion,
                },
            });
            fs.unlink(path.join(CURRENT_DIR, `../public/user/medicion/${nameimg}`), (err) => {
                if (err) {
                    console.error(err)
                }
                console.log(`La img ${nameimg} se elimino del servidor`)
            })
        }

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
            await CategoryModel.update({
                img_category, name_category, fk_system_id
            },
                {
                    where: {
                        id_category: id_category
                    }
                }
            ).then((success) => {
                if (success[0] > 0) {
                    responseapi.setStatus(200, "success", "Categoria actualizada correctamente")
                } else {
                    responseapi.setStatus(404, "info", "No existe la categotia solicitada");
                }
            })
                .catch((err) => {
                    responseapi.setStatus(500, "error", "Error al actualizar la categoria")
                });
        }
        // RETORNA LA RESPUESTA FINAL DEPENDIENDO DE SI FUE EXITOSA O NO
        res.json(responseapi.toResponse());

    } catch (error) {
        httpError(res, error)
    }
};

/* FALTA AUN  */
/* METODO DELETE */
export const deleteMedicion = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const { id_medicion } = req.params
        // CONSULTAR IMAGENES ADJUNTAS
        const adjuntos = await AdjuntoModel.findAll({
            attributes: ['archivo_adjunto'],
            where: {
                fk_medicion_id: id_medicion,
            },
        });

        MedicionModel.destroy({
            where: { id_medicion: id_medicion }
        }).then((success) => {
            if (success > 0) { // ELIMINADO
                if (!adjuntos) {
                    responseapi.setStatus(200, 'success', 'Medición eliminada correctamente');
                    res.json(responseapi.toResponse());
                } else {
                    adjuntos.map(object => {
                        const nameimg = object.dataValues.archivo_adjunto;
                        fs.unlink(path.join(CURRENT_DIR, `../public/user/medicion/${nameimg}`), (err) => {
                            if (err) {
                                console.error("*** Error eliminar img medición ****", err);
                            }
                        })
                    });
                    responseapi.setStatus(200, 'success', 'Medición y archivos adjuntos eliminados correctamente')
                    res.json(responseapi.toResponse());
                }
            } else { // NO EXISTE EL REGISTRO
                responseapi.setStatus(404, "info", "No existe la medición solicitada");
                res.json(responseapi.toResponse());
            }
        }).catch((error) => {
            console.error("**** Error eliminar medición ****", error);
            responseapi.setStatus(500, "error", "Error al eliminar medición");
            res.json(responseapi.toResponse());
        })

    } catch (error) {
        httpError(res, error)
    }
};


/* EXPORT DATA */
export const exportMedicciones = async (req, res) => {
    const responseapi = new ResponseApi();
    try {
        const mediciones = await MedicionModel.findAll({
            include: [
                {
                    model: WUnitModel,
                    attributes: ["name_wunit"]
                },
                {
                    model: MUnitModel,
                    attributes: ["name_munit"]
                },
                {
                    model: CultiveModel,
                    attributes: ['name_cultive'],
                    include: [
                        {
                            model: FincaModel,
                            attributes: ['name_finca']
                        },
                        {
                            model: SubcategoryModel,
                            attributes: ['name_subcategory'],
                            include: [
                                {
                                    model: CategoryModel,
                                    attributes: ["name_category"]
                                }
                            ]
                        }
                    ]
                },
            ]
        })
        if (mediciones.length > 0) {
            const resultado = mediciones.map(object => {
                const promedio_medicion = object.dataValues.promedio_medicion;
                const peso_promedio = object.dataValues.pspromedio_medicion;
                const unidad_peso = object.WUnitModel.name_wunit;
                const talla_medicion = object.dataValues.talla_medicion;
                const unidad_medida = object.MUnitModel.name_munit;
                const desecho = object.dataValues.desecho;
                const observacion_medicion = object.dataValues.observacion_medicion;
                const categoria = object.CultiveModel.SubcategoryModel.CategoryModel.name_category;
                const subcategoria = object.CultiveModel.SubcategoryModel.name_subcategory;
                const fecha_lectura = object.dataValues.created_at;
                const nombre_finca = object.CultiveModel.FincaModel.name_finca;
                const nombre_cultivo = object.CultiveModel.name_cultive;
                return {
                    promedio_medicion, peso_promedio, unidad_peso, talla_medicion, unidad_medida,
                    desecho, observacion_medicion, categoria, subcategoria, fecha_lectura, nombre_finca, nombre_cultivo
                };
            });
            responseapi.setResult(resultado)
        } else {
            responseapi.setStatus(404, 'info', 'No existen mediciones registradas')
        }
        res.json(responseapi.toResponse())
    } catch (error) {
        httpError(res, error)
    }
};