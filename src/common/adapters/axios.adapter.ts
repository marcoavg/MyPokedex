import axios, { AxiosInstance } from "axios";
import { HttpAdapter } from "../interfaces/http-adapter.interface";
import { Injectable } from "@nestjs/common";


@Injectable()
export class AxiosAdapter implements HttpAdapter {
     private axios: AxiosInstance = axios;
     async get<T>(url: string, options?: any): Promise<T> {
        try {
            const { data } = await this.axios.get<T>(url, options);
            return data;
        } catch (error) {
            throw new Error(`Error in GET request: ${error}`);
        }
    }
    async post<T>(url: string, body: any, options?: any): Promise<T> {
        try {
            const { data } = await this.axios.post<T>(url, body, options);
            return data;
        } catch (error) {
            throw new Error(`Error in POST request: ${error}`);
        }
    }
    async put<T>(url: string, body: any, options?: any): Promise<T> {
        try {
            const { data } = await this.axios.put<T>(url, body, options);
            return data;
        } catch (error) {
            throw new Error(`Error in PUT request: ${error}`);
        }
    }
    async delete<T>(url: string, options?: any): Promise<T> {
        try {
            const { data } = await this.axios.delete<T>(url, options);
            return data;
        } catch (error) {
            throw new Error(`Error in DELETE request: ${error}`);
        }
    }
}