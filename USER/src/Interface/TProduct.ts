export type TProduct = {
  id: number;
  name: string;
  slug: string;
  categoryID: number;
  categoryName: string;
  resources: string[];
  minPrice: number;
  maxPrice: number;
  isPromo: boolean;
  isCombo: boolean;
};
