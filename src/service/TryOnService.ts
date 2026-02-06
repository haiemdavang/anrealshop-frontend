// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// export interface TryOnRequest {
//   userImage: string; // Base64 or URL
//   productId: string;
//   productImageUrl: string;
// }

// export interface TryOnResponse {
//   resultImageUrl: string;
//   processingTime: number;
// }

// export const TryOnService = {
//   async tryOnCloth(request: TryOnRequest): Promise<TryOnResponse> {
//     const response = await axios.post<TryOnResponse>(
//       `${API_BASE_URL}/try-on`,
//       request
//     );
//     return response.data;
//   },

//   async getRecommendedProducts(userId?: string): Promise<any[]> {
//     const response = await axios.get(`${API_BASE_URL}/try-on/recommended`, {
//       params: { userId }
//     });
//     return response.data;
//   }
// };
