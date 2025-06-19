// Define the API response type
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination: any;
}