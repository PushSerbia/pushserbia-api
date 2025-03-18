import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  import { QueryFailedError } from 'typeorm';
  
  @Catch()
  export class ExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
      const ctx      = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request  = ctx.getRequest<Request>();
  
      let status  = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = 'Internal server error';
  
      if (exception instanceof HttpException) {
        status  = exception.getStatus();
        const res = exception.getResponse();
        message = typeof res === 'string' ? res : (res as any).message;
      }
      else if (exception instanceof QueryFailedError) {
        if ((exception as any).code === '23505') {
          status  = HttpStatus.CONFLICT;
          message = (exception as any).detail || 'Duplicate key error';
        } else {
          message = (exception as any).message;
        }
      }
      else if (exception instanceof Error) {
        message = exception.message;
      }
  
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
      });
    }
  }