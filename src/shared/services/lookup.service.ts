import { apiService } from '@shared/services';
import type { Response } from '@shared/types';
import type { Lookup } from '@shared/types';

class LookupService {
  async fetchLookups(): Promise<Response<Lookup>> {
    const response =
      await apiService.get<Response<Lookup>>(`/lookups/products`);
    return response.data;
  }
}

export const lookupService = new LookupService();
