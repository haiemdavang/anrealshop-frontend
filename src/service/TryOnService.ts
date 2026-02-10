import { API_ENDPOINTS } from '../constant';
import { axiosInstance } from './AxiosInstant';
import type { TryOnRequest, TryOnResponse } from '../types/TryOnType';

class TryOnService {
  async tryOn(request: TryOnRequest): Promise<TryOnResponse> {
    const response = await axiosInstance.post<TryOnResponse>(
      API_ENDPOINTS.TRYON.DETECT,
      {
        personImageBase64: request.personImageBase64,
        productImageBase64: request.productImageBase64,
        baseSteps: request.baseSteps || 25,
      }
    );
    return response.data;
  }
}

export default new TryOnService();
