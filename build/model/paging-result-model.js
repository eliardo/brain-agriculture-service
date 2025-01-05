"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagingResultModel = void 0;
class PagingResultModel {
    constructor(currentPage, count, totalItens, itens) {
        this.count = count;
        this.totalItens = totalItens;
        this.currentPage = currentPage;
        this.itens = itens;
    }
}
exports.PagingResultModel = PagingResultModel;
//# sourceMappingURL=paging-result-model.js.map