export type IPaintDetail = {
    
    productId: string,

    colorId: string;

    colorName: string;

    colorCode: string;

    hexCode: string;

    surfaceType: string;

    volume: string;

    extraSpecs: Record<string, string | number | boolean | null>;
}   