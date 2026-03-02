import { IsNotEmpty, IsString, IsOptional, IsInt } from 'class-validator';

export class CreatePsContactDto {
  @IsNotEmpty()
  @IsString()
  id: string; // L'URL de contact (sip:...)

  @IsOptional()
  @IsString()
  uri?: string;

  @IsOptional()
  // On accepte string ou number car bigint peut être grand
  expiration_time?: string; 

  @IsOptional()
  @IsInt()
  qualify_frequency?: number;

  @IsOptional()
  @IsString()
  endpoint?: string;

  @IsOptional()
  @IsString()
  user_agent?: string;
}