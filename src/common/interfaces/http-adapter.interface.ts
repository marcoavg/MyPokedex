import e from "express";

export interface HttpAdapter {
  get<T>(url: string, options?: any): Promise<T>;
  post<T>(url: string, body: any, options?: any): Promise<T>;
  // Implement other HTTP methods as needed (put, delete, etc.)
}