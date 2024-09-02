import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from 'axios';

const instance: AxiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    timeout: 10000,
});

interface ApiResponse {
    code: number;
    message: string;
    data: any;
}

instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');

        if (!config.headers) {
            config.headers = config.headers || {};
        }

        if (token) {
            // 设置 Authorization header
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('请求拦截器错误:', error);
        return Promise.reject(error);
    }
);




instance.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response.data.status === 200) {
            return response.data;
        } else {
            console.error(response.data.message);
        }
        return response.data;
    },
    (error) => {
        if (error.response && error.response.status) {
            switch (error.response.status) {
                case 400:
                    console.error('请求错误 400 ，请重新申请');
                    break;
                case 401:
                    console.error('登录错误 401 ，请重新登录');
                    break;
                case 403:
                    console.error('拒绝访问 403 ');
                    break;
                case 404:
                    console.error('请求出错 404 ');
                    break;
                case 408:
                    console.error('请求超时 408 ');
                    break;
                case 500:
                    console.error('服务器错误 500 ，请重启软件或切换功能页！');
                    break;
                // 处理其他错误状态码...
                default:
                    console.error('网络连接出错');
            }
        } else {
            console.error('连接服务器失败,请退出重试!');
        }
        return Promise.reject(error);
    }
);

const requests = async (method: string, url: string, data?: any, config?: AxiosRequestConfig) => {
    try {
        return await instance.request({
            method,
            url,
            data,
            ...config,
        });
    } catch (error) {
        // 这里可以处理一些通用的错误逻辑，如 Token 过期等
        throw error;
    }
};

export const get = (url: string, config?: AxiosRequestConfig) => requests('get', url, undefined, config);
export const post = (url: string, data?: any, config?: AxiosRequestConfig) => requests('post', url, data, config);
export const put = (url: string, data?: any, config?: AxiosRequestConfig) => requests('put', url, data, config);
export const del = (url: string, config?: AxiosRequestConfig) => requests('delete', url, undefined, config);

// 提交图片的 POST 请求
export const postImage = (url: string, imageFile: File, config?: AxiosRequestConfig) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    return post(url, formData, {
        ...config,
        headers: {
            'Content-Type': 'multipart/form-data',
            ...config?.headers,
        },
    });
};

// 图片加文本的 POST 请求
export const postImageWithText = (url: string, imageFile: File, textData: any, config?: AxiosRequestConfig) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('text', JSON.stringify(textData));

    return post(url, formData, {
        ...config,
        headers: {
            'Content-Type': 'multipart/form-data',
            ...config?.headers,
        },
    });
};

export default instance;
