import { apiService } from "@/shared/services";
import type { Response, ResponseBase } from "@/shared/types";
import type { Product, AddProductRequest, UpdateProductRequest } from "../types";

class ProductsService {
    async fetchProducts(currencyCode?: string): Promise<Response<Product[]>> {
        const response = await apiService.get<Response<Product[]>>(
            `/products`,
            currencyCode ? { currency: currencyCode } : {}
        );
        return response.data;
    }

    async fetchProductById(productId: string, currencyCode?: string): Promise<Response<Product>> {
        const response = await apiService.get<Response<Product>>(
            `/products/${productId}`,
            currencyCode ? { currency: currencyCode } : {}
        );
        return response.data;
    }

    async removeProductById(productId: string): Promise<ResponseBase> {
        const response = await apiService.delete<ResponseBase>(
            `/products/${productId}`
        );
        return response.data;
    }

    async addProduct(payload: AddProductRequest): Promise<Response<Product>> {
        const response = await apiService.post<Response<Product>>(
            `/products`,
            payload
        );
        return response.data;
    }

    async updateProduct(productId: string, payload: UpdateProductRequest): Promise<Response<Product>> {
        const response = await apiService.put<Response<Product>>(
            `/products/${productId}`,
            payload
        );
        return response.data;
    }
}

export const productsService = new ProductsService();