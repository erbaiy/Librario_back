import { Module } from '@nestjs/common';
import { DynamoDBService } from './dynamodb.service';

@Module({
  providers: [DynamoDBService],
  exports: [DynamoDBService], // This allows other modules to use DynamoDBService
})
export class DynamoDBModule {}
