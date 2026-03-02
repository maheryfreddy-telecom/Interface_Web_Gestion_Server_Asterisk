import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PsAuthsService } from './ps_auths.service';
import { PsAuthsController } from './ps_auths.controller';
import { PsAuths } from './entities/ps_auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PsAuths])],
  controllers: [PsAuthsController],
  providers: [PsAuthsService],
})
export class PsAuthsModule {}