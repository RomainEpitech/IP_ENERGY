import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
export interface ApiResponse<T> {
  access_token?: string;
  success: boolean;
  data?: T;
  error?: string;
}

const handleError = (error: AxiosError): ApiResponse<any> => {
  const status: number | undefined = error.response?.status;
  let errorMessage: string = `${status}: `;
  
  if (error.response?.data && typeof error.response.data === 'object') {
    const errorData: any = error.response.data;
    if (errorData.error) {
      errorMessage += errorData.error;
    } else if (errorData.message) {
      errorMessage += errorData.message;
    } else {
      errorMessage += JSON.stringify(errorData);
    }
  } else {
    errorMessage += 'Unknown error';
  }

  return { success: false, error: errorMessage, access_token: undefined };
};

const handleResponse = <T>(response: AxiosResponse<T>): ApiResponse<any> => {
  return { success: true, data: response.data };
};

const fetchApi = async (method: string, endpoint: string, data?: any, headers?: any) => {
  const baseUrl = 'http://127.0.0.1:8000/api';

  try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
          method,
          headers: {
              'Content-Type': 'application/json',
              ...headers,
          },
          body: data ? JSON.stringify(data) : null,
      });

      const result = await response.json();
      if (!response.ok) {
          return { success: false, error: result.message };
      }
      return { success: true, data: result };
  } catch (error) {
      return { success: false, error: error.message };
  }
};

export default fetchApi;