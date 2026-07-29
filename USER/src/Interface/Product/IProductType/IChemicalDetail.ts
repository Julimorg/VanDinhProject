import type { TypeDetailBase } from './IProductTypes';

export interface ChemicalDetailData extends TypeDetailBase {

  productId?: string;

  chemicalType?: string;

  volume?: string;
}
