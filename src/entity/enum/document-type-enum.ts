import { BadRequestError } from 'routing-controllers';

export enum DocumentTypeEnum {
  CPF = 1,
  CNPJ = 2,
}

export const toDocumentTypeEnum = (term: any): DocumentTypeEnum => {
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
      throw new BadRequestError(`Invalid docmentType: [${type}]`);
  }
};
