import { PartialType } from '@nestjs/mapped-types';
import { CreateCdrDto } from './create-cdr.dto';

export class UpdateCdrDto extends PartialType(CreateCdrDto) {}
