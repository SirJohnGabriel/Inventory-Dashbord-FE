export interface Response<T> {
  data: T;
  message?: string;
  errorCode?: string;
}

export type ResponseBase = {
  message?: string;
  errorCode?: string;
};

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
