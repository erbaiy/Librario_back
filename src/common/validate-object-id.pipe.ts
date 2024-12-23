import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ValidateDynamoDBKeyPipe implements PipeTransform {
  transform(value: any) {
    if (!isUUID(value)) {
      throw new BadRequestException('Invalid DynamoDB Key: must be a valid UUID');
    }
    return value;
  }
}
