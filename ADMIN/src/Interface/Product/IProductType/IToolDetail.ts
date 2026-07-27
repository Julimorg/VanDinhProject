export type IToolDetail = {
    
    productId: string,

    toolType: String;

    volume: string;
    
    extraSpecs: Record<string, string | number | boolean | null>;
}
