import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface ICommunication {
  get(url: string, config?: any): Promise<any>;

  put(url: string, data: any, config?: AxiosRequestConfig<any>): Promise<any>;

  post(url: string, data: any, config?: AxiosRequestConfig<any>): Promise<any>;

  delete(url: string, config?: any): Promise<any>;
}
export default class Http implements ICommunication {
  httpClient: AxiosInstance;
  baseURL: string;

  constructor(baseURL = 'http://localhost:8080/') {
    this.baseURL = baseURL;
    const axiosConfig = {
      baseURL,
      withCredentials: true,
    };
    this.httpClient = axios.create(axiosConfig);
  }

  async get(url: string, config?: AxiosRequestConfig<any>) {
    return this.httpClient.get(url, {
      headers: {
        'cors-proxy-url': this.baseURL,
      },
      ...config,
    });
  }

  async post(url: string, data: any, config?: AxiosRequestConfig<any>) {
    return this.httpClient.post(url, data, {
      headers: {
        'cors-proxy-url': this.baseURL,
      },
      ...config,
    });
  }

  async put(url: string, data: any, config?: AxiosRequestConfig<any>) {
    return this.httpClient.put(url, data, {
      headers: {
        'cors-proxy-url': this.baseURL,
      },
      ...config,
    });
  }

  async delete(url: string, config?: AxiosRequestConfig<any>) {
    return this.httpClient.delete(url, {
      headers: {
        'cors-proxy-url': this.baseURL,
      },
      ...config,
    });
  }
}
