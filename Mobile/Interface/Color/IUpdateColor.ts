export type IUpdateColorRequest = { 
    colorName: string,
    colorCode: string,
    colorDescription: string,
    colorImg: File
}

export type IUpdateColorResponse = {
    colorId: string,
    colorName: string,
    colorCode: string,
    colorDescription: string,
    colorImg: string
}