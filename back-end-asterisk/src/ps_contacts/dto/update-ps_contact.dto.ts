import { PartialType } from '@nestjs/mapped-types';
import { CreatePsContactDto } from './create-ps_contact.dto';

export class UpdatePsContactDto extends PartialType(CreatePsContactDto) {}