import type { TypeDetailBase } from './IProductTypes';

export interface ToolDetailData extends TypeDetailBase {
  productId?: string;
  toolType?: string;
  volume?: string;
}
