import requests from "@/utils/requests";
import { AxiosRequestConfig } from 'axios';

export async function GetList() {
    const url = "v1/blood_status_list"
    const params = {
        page:1,
        pageSize:10,
    }
    try {
        const config: AxiosRequestConfig = {
            params, // 将查询参数放入 params 属性
        };
        const response = await requests.get("v1/blood_status_list", config);
        if (response.status == 200){
            return response.data
        }
        return []
    } catch (error) {
        console.error('请求:'+url+'错误', error);
    }
}