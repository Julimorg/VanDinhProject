export type ICreateCategoryRequest = {
    categoryName: string,
    categoryDescription: string,
    categoryImage: File,

}

export type ICreateCategoryResponse = {
    categoryId: string,
    categoryName: string,
    categoryDescription: string,
    categoryImage: string,
    createAt: string,
}