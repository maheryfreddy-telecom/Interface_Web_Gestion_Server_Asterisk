import { IsString, IsOptional, IsInt, IsDateString } from 'class-validator';

export class CreateCdrDto {
  // CDR est un peu spécial, parfois Asterisk génère l'uniqueid, parfois non.
  @IsOptional()
  @IsString()
  uniqueid?: string;

  @IsOptional()
  @IsString()
  src?: string;

  @IsOptional()
  @IsString()
  dst?: string;

  @IsOptional()
  @IsString()
  dcontext?: string;

  @IsOptional()
  @IsString()
  clid?: string;

  @IsOptional()
  @IsString()
  channel?: string;

  @IsOptional()
  @IsString()
  dstchannel?: string;

  @IsOptional()
  @IsString()
  lastapp?: string;

  @IsOptional()
  @IsString()
  lastdata?: string;

  @IsOptional()
  @IsDateString() // Valide que c'est une date (ISO 8601)
  start?: Date;

  @IsOptional()
  @IsDateString()
  answer?: Date;

  @IsOptional()
  @IsDateString()
  end?: Date;

  @IsOptional()
  @IsInt()
  duration?: number;

  @IsOptional()
  @IsInt()
  billsec?: number;

  @IsOptional()
  @IsString()
  disposition?: string; // ANSWERED, BUSY, FAILED...
}