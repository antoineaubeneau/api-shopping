export interface AddToBasketDto {
    id: string;
    quantity: number;
}

export interface BasketDto {
    totalPrice: number;
    products: ProductsAddedToBasketDto[];
}

export interface ProductsAddedToBasketDto {
    id: string;
    name: string;
    description: string;
    unitPrice: number;
    quantity: number;
}

export interface AvailableProductDto {
    id: string;
    name: string;
    description: string;
    unitPrice: number;
}