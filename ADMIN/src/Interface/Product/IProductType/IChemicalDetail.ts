export type IChemicalDetail = {

    productId: string,
    
    chemicalType: String;

    volume: string;

    extraSpecs: Record<string, string | number | boolean | null>;
}