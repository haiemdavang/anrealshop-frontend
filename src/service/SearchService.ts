import { axiosNoWithCredInstance } from './AxiosInstant';
import { API_ENDPOINTS } from '../constant';
import type { PublicSearchResponse } from '../types/SearchType';

export const SearchService = {
  suggestSearch: async (
    keyword: string,
    productLimit: number = 5,
    categoryLimit: number = 3
  ): Promise<PublicSearchResponse> => {
    const response = await axiosNoWithCredInstance.get<PublicSearchResponse>(
      API_ENDPOINTS.SEARCH.SUGGEST,
      {
        params: {
          keyword,
          productLimit,
          categoryLimit,
        },
      }
    );
    return response.data;
  },
};
