import { apiService } from "@/shared/services";
import type { Response } from "@/shared/types";
import type { Products } from "../types";

class ProductsService {
    async fetchProducts(currencyCode?: string): Promise<Response<Products[]>> {
        const response = await apiService.get<Response<Products[]>>(
            `/products`,
            currencyCode ? { currency: currencyCode } : {}
        );
        return response.data;
    }
}

export const productsService = new ProductsService();