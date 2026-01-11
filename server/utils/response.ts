import { Response } from 'express';
import { ApiResponse, ApiError } from '../types';

export const sendSuccess = <T>(res: Response, data: T, message?: string): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  res.json(response);
};

export const sendError = (res: Response, error: ApiError): void => {
  const response: ApiResponse<null> = {
    success: false,
    error: error.message,
  };
  res.status(error.status).json(response);
};

export const sendValidationError = (res: Response, message: string): void => {
  sendError(res, {
    status: 400,
    message,
    code: 'VALIDATION_ERROR',
  });
};

export const sendNotFound = (res: Response, resource: string): void => {
  sendError(res, {
    status: 404,
    message: `${resource} not found`,
    code: 'NOT_FOUND',
  });
};

export const sendServerError = (res: Response, message: string = 'Internal server error'): void => {
  sendError(res, {
    status: 500,
    message,
    code: 'INTERNAL_ERROR',
  });
};
