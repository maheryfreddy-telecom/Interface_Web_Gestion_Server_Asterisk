import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PsAorsService } from './ps_aors.service';
import { PsAorsController } from './ps_aors.controller';
import { PsAors } from './entities/ps_aor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PsAors])],
  controllers: [PsAorsController],
  providers: [PsAorsService],
})
export class PsAorsModule {}