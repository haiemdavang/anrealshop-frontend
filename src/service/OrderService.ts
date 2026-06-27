import { API_ENDPOINTS } from "../constant";
import type { UseOrderParams } from "../hooks/useOrder";
import type { MyShopOrderListResponse, OrderRejectRequest, OrderStatusDto, UserOrderDetailDto, UserOrderListResponse } from "../types/OrderType";
import { axiosInstance } from "./AxiosInstant";

export interface ExportOrdersParams {
    preparingStatus: 'all' | 'PREPARING' | 'CONFIRMED';
    startDate: string;
    endDate: string;
}

interface ExportOrdersResult {
    file: Blob;
    filename?: string;
}

const getOrderMetaData = async (): Promise<OrderStatusDto[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORDERS.MYSHOP_META_DATA);
    return response.data;
};

const getMyShopOrders = async (params?: UseOrderParams): Promise<MyShopOrderListResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORDERS.MYSHOP_ORDERS, { params });
    return response.data;
}; 

const exportMyShopOrders = async (params: ExportOrdersParams): Promise<ExportOrdersResult> => {
    const response = await axiosInstance.get<Blob>(API_ENDPOINTS.ORDERS.MYSHOP_EXPORT, {
        params,
        responseType: 'blob',
    });

    const contentDisposition = response.headers['content-disposition'] as string | undefined;
    const encodedFilename = contentDisposition?.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
    const fallbackFilename = contentDisposition?.match(/filename="?([^";]+)"?/i)?.[1];
    const filename = encodedFilename
        ? decodeURIComponent(encodedFilename)
        : fallbackFilename;

    return {
        file: response.data,
        filename,
    };
};

const getOrderDetail = async (orderId: string): Promise<UserOrderDetailDto> => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.ORDERS.USER_ORDER_DETAILS(orderId)}`);
    return response.data;
};


const approveOrder = async (shopOrderId: string): Promise<void> => {
    await axiosInstance.put(API_ENDPOINTS.ORDERS.MYSHOP_APPROVAL(shopOrderId));
};

const approveOrders = async (shopOrderIds: string[]): Promise<void> => {
    await axiosInstance.put(API_ENDPOINTS.ORDERS.MYSHOP_APPROVALS, shopOrderIds);
};

const rejectOrder = async (orderItemId: string, reason: string): Promise<void> => {
    await axiosInstance.put(API_ENDPOINTS.ORDERS.MYSHOP_REJECT(orderItemId), reason);
};


const rejectOrders = async (orderRejectRequest: OrderRejectRequest): Promise<void> => {
    await axiosInstance.put(API_ENDPOINTS.ORDERS.MYSHOP_REJECTS, orderRejectRequest);
};


const getUserOrders = async (params?: UseOrderParams): Promise<UserOrderListResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORDERS.USER_ORDERS, { params });
    return response.data;
}; 


const rejectShopOrder = async (shopOrderId: string, reason: string): Promise<void> => {
    await axiosInstance.put(API_ENDPOINTS.ORDERS.USER_REJECT_ORDER(shopOrderId), reason);
};



export const OrderService = {
    getOrderMetaData,
    getMyShopOrders,
    exportMyShopOrders,
    getOrderDetail,
    approveOrder,
    approveOrders,
    rejectOrder,
    rejectOrders,

    getUserOrders,
    rejectShopOrder,
};
