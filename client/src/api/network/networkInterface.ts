import { AxiosRequestConfig } from 'axios';
import { ICheckDuplicate, ILogin, ISignup } from './auth';
import { ICommunication } from './network';

export default class NetworkInterface {
  constructor(private apiClient: ICommunication) {
    this.apiClient = apiClient;
  }

  async login(payload: ILogin, options?: AxiosRequestConfig) {
    const url = '/login';
    return this.apiClient.post(url, payload, options);
  }

  async signUp(payload: ISignup, options?: AxiosRequestConfig) {
    const url = '/join';
    return this.apiClient.post(url, payload, options);
  }

  async checkDuplicateId(
    payload: ICheckDuplicate,
    options?: AxiosRequestConfig
  ) {
    const url = '/join/duplicate-id';
    return this.apiClient.post(url, payload, options);
  }

  async findRoom() {
    const url = '/rooms';
    return this.apiClient.get(url);
  }

  async getRecord(userId: string) {
    const url = `/record?id=${userId}`;
    return this.apiClient.get(url);
  }
}
