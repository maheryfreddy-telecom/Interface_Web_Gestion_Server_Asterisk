import { PartialType } from '@nestjs/mapped-types';
import { CreatePsAorsDto } from './create-ps_aor.dto';

// PartialType rend automatiquement toutes les propriétés de CreatePsAorsDto optionnelles
export class UpdatePsAorsDto extends PartialType(CreatePsAorsDto) {}