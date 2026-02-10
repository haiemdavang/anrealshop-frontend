export interface TryOnRequest {
  personImageBase64: string;
  productImageBase64: string;
  baseSteps?: number;
}

export interface TryOnResponse {
  resultImageBase64: string;
  mimeType: string;
  success: boolean;
  message: string;
}