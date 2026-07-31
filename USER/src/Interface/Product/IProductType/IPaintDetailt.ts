import type { TypeDetailBase } from './IProductTypes';

export interface PaintDetailData extends TypeDetailBase {
  productId?: string;
  colorName?: string;
  colorCode?: string;
  hexCode?: string;
  surfaceType?: string;
  finishType?: string;
  volume?: string;
}
