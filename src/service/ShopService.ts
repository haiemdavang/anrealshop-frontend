import { API_ENDPOINTS } from "../constant";
import type { ShopCreateRequest, ShopUpdateRequest, ShopDto, ShopDetailDto } from "../types/ShopType";
import { axiosInstance, axiosNoWithCredInstance } from "./AxiosInstant";

const createShop = async (shopData: ShopCreateRequest) => {
    const response = await axiosInstance.post(
        `${API_ENDPOINTS.SHOPS.REGISTER}`, shopData
    );
    return response.data;
}

const updateShop = async (shopData: ShopUpdateRequest): Promise<ShopDto> => {
    const response = await axiosInstance.put(
        `${API_ENDPOINTS.SHOPS.INFO}`, shopData
    );
    return response.data;
}

const getShopDetails = async (id: string, isSale: boolean = true): Promise<ShopDto | ShopDetailDto> => {
    const params = new URLSearchParams();
    if (isSale) {
        params.append('isSale', 'true');
    }
    const response = await axiosNoWithCredInstance.get(
        `${API_ENDPOINTS.SHOPS.PUBLIC_DETAILS(id)}`,
        { params }
    );
    return response.data;
}

const ShopService = {
    createShop,
    updateShop,
    getShopDetails
};

export default ShopService;