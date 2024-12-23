import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationError } from 'class-validator';

@Catch()
export class BooksExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
        message = Array.isArray(exceptionResponse['message']) 
          ? exceptionResponse['message'][0] 
          : exceptionResponse['message'];
        errors = Array.isArray(exceptionResponse['message'])
          ? this.formatValidationErrors(exceptionResponse['message'])
          : exceptionResponse;
      } else {
        message = exceptionResponse as string;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      errors = {
        error: exception.name,
        detail: exception.message
      };
    }

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
        errors
      });
  }

  private formatValidationErrors(errors: any[]) {
    const formattedErrors: Record<string, string[]> = {};
  
    errors.forEach((error) => {
      const field = error.property; // Assuming 'property' identifies the field
      const messages = error.message || error.messages || []; // Adjust for your error structure
  
      if (!formattedErrors[field]) {
        formattedErrors[field] = [];
      }
  
      if (Array.isArray(messages)) {
        messages.forEach((message) => {
          if (message && typeof message === 'string') {
            formattedErrors[field].push(message.trim());
          }
        });
      } else if (typeof messages === 'string') {
        formattedErrors[field].push(messages.trim());
      }
    });
  
    return formattedErrors;
  }
  
}
