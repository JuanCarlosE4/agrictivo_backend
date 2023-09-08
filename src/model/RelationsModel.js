import PermissionModel from './PermissionModel.js';
import HPermissionModel from './hasPermissionModel.js';
import UserModel from './UserModel.js';
import RoleModel from './RoleModel.js';
import DepartmentModel from './DepartmentModel.js'
import MunicipalityModel from './MunicipalityModel.js'
import VeredaModel from './VeredaModel.js'
import FincaModel from './FincaModel.js';
import BrokerModel from './BrokerModel.js'
import SystemModel from './SystemModel.js';
import CategoryModel from './CategoryModel.js';
import TUnitModel from './TUnitModel.js'
import SubcategoryModel from './SubcategoryModel.js';
import CultiveModel from './CultiveModel.js';
import WUnitModel from './WUnitModel.js';
import MUnitModel from './MUnitModel.js';
import MedicionModel from './MedicionModel.js';
import AdjuntoModel from './AdjuntoModel.js';
import TSensorModel from './Type_SensorModel.js';
import MSensorModel from './Medicion_SensorModel.js';


// RELACION HAS_PERMISSION-PERMISSION
HPermissionModel.belongsTo(PermissionModel, { foreignKey: "fk_permission_id" });
PermissionModel.hasMany(HPermissionModel, { foreignKey: "fk_permission_id" });

// RELACION HAS_PERMISSION-ROLE
HPermissionModel.belongsTo(RoleModel, { foreignKey: "fk_role_id" });
RoleModel.hasMany(HPermissionModel, { foreignKey: "fk_role_id" });

// RELACION USUARIO-ROL
UserModel.belongsTo(RoleModel, { foreignKey: "fk_role_id" });
RoleModel.hasMany(UserModel, { foreignKey: "fk_role_id" });

// RELACION MUNICIPIO-DEPARTAMENTO
MunicipalityModel.belongsTo(DepartmentModel, { foreignKey: "fk_department_id" });
DepartmentModel.hasMany(MunicipalityModel, { foreignKey: "fk_department_id" });

// RELACION VEREDA-MUNICIPIO
VeredaModel.belongsTo(MunicipalityModel, { foreignKey: "fk_municipality_id" });
MunicipalityModel.hasMany(VeredaModel, { foreignKey: "fk_municipality_id" });

// RELACION FINCA-VEREDA
FincaModel.belongsTo(VeredaModel, { foreignKey: "fk_vereda_id" });
VeredaModel.hasMany(FincaModel, { foreignKey: "fk_vereda_id" });

// RELACION FINCA-USUARIO
FincaModel.belongsTo(UserModel, { foreignKey: "fk_user_id" });
UserModel.hasMany(FincaModel, { foreignKey: "fk_user_id" });

// RELACION BROKER-FINCA
BrokerModel.belongsTo(FincaModel, { foreignKey: "fk_finca_id" });
FincaModel.hasMany(BrokerModel, { foreignKey: "fk_finca_id" });

// RELACION CATEGORIA-SISTEMA
CategoryModel.belongsTo(SystemModel, { foreignKey: "fk_system_id" });
SystemModel.hasMany(CategoryModel, { foreignKey: "fk_system_id" });

// RELACION SUBCATEGORIA-CATEGORIA
SubcategoryModel.belongsTo(CategoryModel, { foreignKey: "fk_category_id" });
CategoryModel.hasMany(SubcategoryModel, { foreignKey: "fk_category_id" });

// RELACION SUBCATEGORIA-TUNIT
SubcategoryModel.belongsTo(TUnitModel, { foreignKey: "fk_tunit_id" });
TUnitModel.hasMany(SubcategoryModel, { foreignKey: "fk_tunit_id" });

// RELACION CULTIVE-FINCA
CultiveModel.belongsTo(FincaModel, { foreignKey: "fk_finca_id" });
FincaModel.hasMany(CultiveModel, { foreignKey: "fk_finca_id" });

// RELACION CULTIVE-SUBCATEGORY
CultiveModel.belongsTo(SubcategoryModel, { foreignKey: "fk_subcategory_id" });
SubcategoryModel.hasMany(CultiveModel, { foreignKey: "fk_subcategory_id" });

// RELACION MEDICION-WUNIT
MedicionModel.belongsTo(WUnitModel, { foreignKey: "fk_wunit_id" });
WUnitModel.hasMany(MedicionModel, { foreignKey: "fk_wunit_id" });

// RELACION MEDICION-MUNIT
MedicionModel.belongsTo(MUnitModel, { foreignKey: "fk_munit_id" });
MUnitModel.hasMany(MedicionModel, { foreignKey: "fk_munit_id" });

// RELACION MEDICION-CULTIVO
MedicionModel.belongsTo(CultiveModel, { foreignKey: "fk_cultive_id" });
CultiveModel.hasMany(MedicionModel, { foreignKey: "fk_cultive_id" });

// RELACION ADJUNTO-MEDICION
AdjuntoModel.belongsTo(MedicionModel, { foreignKey: "fk_medicion_id" });
MedicionModel.hasMany(AdjuntoModel, { foreignKey: "fk_medicion_id" });

// RELACION MSENSOR-CULTIVE
MSensorModel.belongsTo(CultiveModel, { foreignKey: "fk_cultive_id" });
CultiveModel.hasMany(MSensorModel, { foreignKey: "fk_cultive_id" });

// RELACION SMEDICION-TSENSOR
MSensorModel.belongsTo(TSensorModel, { foreignKey: "fk_tsensor_id" });
TSensorModel.hasMany(MSensorModel, { foreignKey: "fk_tsensor_id" });

export const RelationsModel = {
    RoleModel,
    PermissionModel,
    HPermissionModel,
    UserModel,
    DepartmentModel,
    MunicipalityModel,
    VeredaModel,
    FincaModel,
    BrokerModel,
    SystemModel,
    CategoryModel,
    TUnitModel,
    SubcategoryModel,
    CultiveModel,
    WUnitModel,
    MUnitModel,
    MedicionModel,
    AdjuntoModel,
    TSensorModel,
    MSensorModel
};