import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PsEndpointsService } from './ps_endpoints.service';
import { PsEndpointsController } from './ps_endpoints.controller';
import { PsEndpoint } from './entities/ps_endpoint.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PsEndpoint])],
  controllers: [PsEndpointsController],
  providers: [PsEndpointsService],
})
export class PsEndpointsModule {}