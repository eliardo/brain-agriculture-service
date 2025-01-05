export class PagingResultModel<T> {
    constructor(
        currentPage: number,
        count: number,
        totalItens: number,
        itens: T,
    ) {
        this.count = count;
        this.totalItens = totalItens;
        this.currentPage = currentPage;
        this.itens = itens;
    }

    currentPage: number;

    count: number;

    totalItens: number;

    itens: T;
}
