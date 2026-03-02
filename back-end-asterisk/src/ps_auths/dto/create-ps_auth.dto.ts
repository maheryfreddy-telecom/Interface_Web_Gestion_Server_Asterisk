import { IsNotEmpty, IsString, IsEnum, IsOptional, IsInt } from 'class-validator';

export class CreatePsAuthsDto {
  @IsNotEmpty()
  @IsString()
  id: string; // ex: '101-auth'

  @IsOptional()
  @IsEnum(['md5', 'userpass'])
  auth_type?: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsOptional()
  @IsInt()
  nonce_lifetime?: number;

  @IsOptional()
  @IsString()
  md5_cred?: string;

  @IsOptional()
  @IsString()
  realm?: string;
}