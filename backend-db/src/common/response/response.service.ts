import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseService {
    buildSuccessResponse(message = 'Operación exitosa', data: any, code = 200) {
        return {
            status: 'success',
            code,
            message,
            data,
        };
    }

    buildErrorResponse(message: string, data: any = null, code = 400) {
        return {
            status: 'error',
            code,
            message,
            data,
        };
    }
}
