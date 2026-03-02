import { PartialType } from '@nestjs/mapped-types';
import { CreatePsEndpointDto } from './create-ps_endpoint.dto';

export class UpdatePsEndpointDto extends PartialType(CreatePsEndpointDto) {}