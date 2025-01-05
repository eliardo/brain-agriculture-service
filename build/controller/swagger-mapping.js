//----------------FARMER -----------------
/**
 * @typedef {object} FarmerCreaterObject
 * @property {string} name.required - Nome completo do fazendeiro
 * @property {string} document.required - Documento de identificação CPF ou CNPJ
 */
/**
 * @typedef {object} FarmerObject
 * @property {number} id - Identificador do fazendeiro na base de dados
 * @property {Date} dateCreated - Data em que o fazendeiro foi cadastrado no sistema
 * @property {Date} dateUpdated - Data em que os dados do fazendeiro foram atualizados pela ultima vez no sistema
 * @property {boolean} deleted - Flag indicadora se o fazendeiro foi deletado do sistema
 * @property {string} name - Nome do fazendeiro
 * @property {string} document - Documento de identificação CPF ou CNPJ
 * @property {integer} documentType - Identificador numerico do tipo de documento cadastrado (1 = CPF, 2 = CNPJ)
 * @property {string} documentTypeName - Nome string do identificador numerico do tipo de documento cadastrado (1 = CPF, 2 = CNPJ)
 */
/**
 * @typedef {object} ResponseModelFarmerObject
 * @property {integer} status.required - Código de retorno HTTP - eg: 201
 * @property {FarmerObject} payload
 */
/**
 * @typedef {object} ResponseModelPaginationFarmerObject
 * @property {integer} count - Quantidade de itens na base de dados com a condição da consulta
 * @property {integer} totalItens - Quantidade de itens na paginação
 * @property {integer} currentPage - Pagina atual
 * @property {Array.<FarmerObject>} itens
 */
//----------------FARM -----------------
/**
 * FarmCreaterObject type
 * @typedef {object} FarmCreaterObject
 * @property {string} name - Nome da fazenda
 * @property {string} city - Cidade onde a fazenda está localizada
 * @property {string} state - Estado onde a fazenda está localizada
 * @property {number} totalArea - Area total da fazenda
 * @property {number} totalPreservationArea - Area de preservação da fazenda
 * @property {number} totalCultivableArea - Area de cultivo da fazenda
 */
/**
 * FarmObject type
 * @typedef {object} FarmObject
 * @property {number} id - Identificador fazenda na base de dados
 * @property {Date} dateCreated - Data em que a fazenda foi criada no sistema
 * @property {Date} dateUpdated - Data em que a fazenda foi atualizada pela ultima vez no sistema
 * @property {boolean} deleted - Flag indicadora se a fazenda foi deletada ou não do sistema
 * @property {string} name - Nome da fazenda
 * @property {string} city - Cidade onde a fazenda está localizada
 * @property {string} state - Estado onde a fazenda está localizada
 * @property {number} totalArea - Area total da fazenda
 * @property {number} totalPreservationArea - Area de preservação da fazenda
 * @property {number} totalCultivableArea - Area de cultivo da fazenda
 */
/**
 * @typedef {object} ResponseModelFarmObject
 * @property {integer} status.required - Código de retorno HTTP - eg: 201
 * @property {FarmObject} payload
 */
/**
 * @typedef {object} ResponseModelPaginationFarmObject
 * @property {integer} count - Quantidade de itens na base de dados com a condição da consulta
 * @property {integer} totalItens - Quantidade de itens na paginação
 * @property {integer} currentPage - Pagina atual
 * @property {Array.<FarmObject>} itens
 */
// -------------------- Harvest
/**
 * @typedef {object} HarvestCreateObject
 * @property {string} culture - Nome da fazenda
 * @property {string} year - Cidade onde a fazenda está localizada
 * @property {string} description - Estado onde a fazenda está localizada
 * @property {number} farmId - fazenda onde a safra foi realizada
 */
/**
 * @typedef {object} Harvestbject
 * @property {number} id - Identificador fazenda na base de dados
 * @property {Date} dateCreated - Data em que a fazenda foi criada no sistema
 * @property {Date} dateUpdated - Data em que a fazenda foi atualizada pela ultima vez no sistema
 * @property {boolean} deleted - Flag indicadora se a fazenda foi deletada ou não do sistema
 * @property {string} culture - Nome da fazenda
 * @property {string} year - Cidade onde a fazenda está localizada
 * @property {string} description - Estado onde a fazenda está localizada
 * @property {FarmObject} farm - fazenda onde a safra foi realizada
 */
/**
 * @typedef {object} ResponseModelHarvestObject
 * @property {integer} status.required - Código de retorno HTTP - eg: 201
 * @property {HarvestCreateObject} payload
 */
/**
 * @typedef {object} ResponseModelPaginationHarvestObject
 * @property {integer} count - Quantidade de itens na base de dados com a condição da consulta
 * @property {integer} totalItens - Quantidade de itens na paginação
 * @property {integer} currentPage - Pagina atual
 * @property {Array.<HarvestCreateObject>} itens
 */ 
//# sourceMappingURL=swagger-mapping.js.map