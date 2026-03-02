import { IsNotEmpty, IsString, IsInt, IsOptional, IsEnum } from 'class-validator';

export class CreatePsAorsDto {
  @IsNotEmpty()
  @IsString()
  id: string; // Obligatoire (ex: '101')

  @IsOptional()
  @IsInt()
  max_contacts?: number; // ex: 1

  @IsOptional()
  @IsEnum(['yes', 'no'])
  remove_existing?: string; // 'yes' ou 'no'

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsInt()
  default_expiration?: number;

  @IsOptional()
  @IsString()
  mailboxes?: string;

  @IsOptional()
  @IsInt()
  minimum_expiration?: number;

  @IsOptional()
  @IsInt()
  qualify_frequency?: number;

  @IsOptional()
  @IsEnum(['yes', 'no'])
  authenticate_qualify?: string;
}