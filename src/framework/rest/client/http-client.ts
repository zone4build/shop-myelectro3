import { AUTH_TOKEN_KEY } from '@/lib/constants';
import type { SearchParamOptions } from '@/types';
import axios from 'axios';
import Cookies from 'js-cookie';
import Router from 'next/router';

function getTenantIdFromHostname(): string {
  // Extract tenant ID from hostname (e.g., toys.zone4build.com -> toys)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');

    // If hostname is like toys.zone4build.com, extract 'toys'
    if (parts.length >= 3 && parts[1] === 'zone4build') {
      return parts[0];
    }

    // For localhost or other patterns, use env var
    return process.env.NEXT_PUBLIC_TENANT_ID || 'zone4food';
  }

  // Server-side: use env var
  return process.env.NEXT_PUBLIC_TENANT_ID || 'zone4food';
}

const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REST_API_ENDPOINT,
  timeout: 30000,
  headers: {
    'x-tenant-id': getTenantIdFromHostname(),
    'Content-Type': 'application/json',
  },
});
// Change request data/error here
httpClient.interceptors.request.use((config) => {
  const token = Cookies.get(AUTH_TOKEN_KEY);

  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${token ? token : ''}`,
    'x-tenant-id': getTenantIdFromHostname(), // Update tenant ID on each request
  };
  return config;
});

// Change response data/error here
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      (error.response && error.response.status === 401) ||
      (error.response && error.response.status === 403) ||
      (error.response &&
        error.response.data.message === 'PICKBAZAR_ERROR.NOT_AUTHORIZED')
    ) {
      Cookies.remove(AUTH_TOKEN_KEY);
      Router.reload();
    }
    return Promise.reject(error);
  }
);

export class HttpClient {
  static async get<T>(url: string, params?: unknown) {
    const response = await httpClient.get<T>(url, { params });
    return response.data;
  }

  static async post<T>(url: string, data: unknown, options?: any) {
    const response = await httpClient.post<T>(url, data, options);
    return response.data;
  }

  static async put<T>(url: string, data: unknown) {
    const response = await httpClient.put<T>(url, data);
    return response.data;
  }

  static async delete<T>(url: string) {
    const response = await httpClient.delete<T>(url);
    return response.data;
  }

  static formatSearchParams(params: Partial<SearchParamOptions>) {
    return Object.entries(params)
      .filter(([, value]) => Boolean(value))
      .map(([k, v]) =>
        ['type', 'categories', 'tags', 'author', 'manufacturer'].includes(k)
          ? `${k}.slug:${v}`
          : `${k}:${v}`
      )
      .join(';');
  }
}
