import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

export class CreatePsEndpointDto {
  @IsNotEmpty()
  @IsString()
  id: string; // ex: '101'

  @IsOptional()
  @IsString()
  transport?: string;

  @IsOptional()
  @IsString()
  aors?: string;

  @IsOptional()
  @IsString()
  auth?: string;

  @IsOptional()
  @IsString()
  context?: string;

  @IsOptional()
  @IsString()
  disallow?: string;

  @IsOptional()
  @IsString()
  allow?: string;

  // Les ENUMs 'yes'/'no' d'Asterisk
  @IsOptional()
  @IsEnum(['yes', 'no'])
  direct_media?: string;

  @IsOptional()
  @IsEnum(['yes', 'no'])
  force_rport?: string;

  @IsOptional()
  @IsEnum(['yes', 'no'])
  ice_support?: string;

  @IsOptional()
  @IsEnum(['yes', 'no'])
  rewrite_contact?: string;

  @IsOptional()
  @IsEnum(['yes', 'no'])
  rtp_symmetric?: string;
}