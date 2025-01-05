"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDocumentTypeEnum = exports.DocumentTypeEnum = void 0;
const routing_controllers_1 = require("routing-controllers");
var DocumentTypeEnum;
(function (DocumentTypeEnum) {
    DocumentTypeEnum[DocumentTypeEnum["CPF"] = 1] = "CPF";
    DocumentTypeEnum[DocumentTypeEnum["CNPJ"] = 2] = "CNPJ";
})(DocumentTypeEnum = exports.DocumentTypeEnum || (exports.DocumentTypeEnum = {}));
const toDocumentTypeEnum = (term) => {
    let type = term;
    if (!isNaN(term)) {
        type = DocumentTypeEnum[parseInt(term, 10)];
    }
    switch (type) {
        case 'CPF':
            return DocumentTypeEnum.CPF;
        case 'CNPJ':
            return DocumentTypeEnum.CNPJ;
        default:
            throw new routing_controllers_1.BadRequestError(`Invalid docmentType: [${type}]`);
    }
};
exports.toDocumentTypeEnum = toDocumentTypeEnum;
//# sourceMappingURL=document-type-enum.js.map