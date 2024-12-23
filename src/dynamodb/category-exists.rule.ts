import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { DynamoDBService } from './dynamodb.service';

@ValidatorConstraint({ name: 'CategoryExists', async: true })
@Injectable()
export class CategoryExistsRule implements ValidatorConstraintInterface {
  constructor(private readonly dynamoDBService: DynamoDBService) {

    console.log('CategoryExistsRule: DynamoDBService injected:', !!this.dynamoDBService);

  }
  

  async validate(categoryId: string): Promise<boolean> {
    console.log('DynamoDBService:',categoryId ); // Debugging output

    if (!this.dynamoDBService) {
      throw new Error('DynamoDBService is not injected!');
    }

    try {
      const category = await this.dynamoDBService.get('Categories', { id: categoryId });
      return !!category; // Return true if category exists
    } catch (error) {
      console.error('Error in category validation:', error);
      return false;
    }
  }

  defaultMessage(): string {
    return 'The specified category does not exist.';
  }
}
