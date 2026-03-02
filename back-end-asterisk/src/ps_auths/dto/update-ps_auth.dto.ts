import { PartialType } from '@nestjs/mapped-types';
import { CreatePsAuthsDto } from './create-ps_auth.dto';

export class UpdatePsAuthsDto extends PartialType(CreatePsAuthsDto) {}