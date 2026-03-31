export interface SuccessResponse<T = any> {
  success: true;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  statusCode: number;
  stack?: string;
}

export const successResponse = <T = any>(
  message: string,
  data?: T,
  meta?: SuccessResponse['meta']
): SuccessResponse<T> => {
  const response: SuccessResponse<T> = {
    success: true,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  if (meta) {
    response.meta = meta;
  }

  return response;
};

export const errorResponse = (
  message: string,
  statusCode: number = 500,
  errors?: ErrorResponse['errors']
): ErrorResponse => {
  return {
    success: false,
    message,
    statusCode,
    ...(errors && { errors }),
  };
};

export const paginatedResponse = <T = any>(
  message: string,
  data: T[],
  page: number,
  limit: number,
  total: number
): SuccessResponse<T[]> => {
  return successResponse(message, data, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
};
