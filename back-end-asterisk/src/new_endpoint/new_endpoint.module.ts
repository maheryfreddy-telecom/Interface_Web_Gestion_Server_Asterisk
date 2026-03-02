import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewEndpointService } from './new_endpoint.service';
import { NewEndpointController } from './new_endpoint.controller';
import { PsAors } from '../ps_aors/entities/ps_aor.entity';
import { PsAuths } from '../ps_auths/entities/ps_auth.entity';
import { PsEndpoint } from '../ps_endpoints/entities/ps_endpoint.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PsAors, PsAuths, PsEndpoint])],
  controllers: [NewEndpointController],
  providers: [NewEndpointService],
})
export class NewEndpointModule {}