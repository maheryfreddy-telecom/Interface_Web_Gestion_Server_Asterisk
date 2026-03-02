import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PsEndpointsService } from './ps_endpoints.service';
import { CreatePsEndpointDto } from './dto/create-ps_endpoint.dto';
import { UpdatePsEndpointDto } from './dto/update-ps_endpoint.dto';

@ApiTags('Endpoints')
@Controller('ps-endpoints')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PsEndpointsController {
  constructor(private readonly psEndpointsService: PsEndpointsService) {}

  @Post()
  create(@Body() createPsEndpointDto: CreatePsEndpointDto) {
    return this.psEndpointsService.create(createPsEndpointDto);
  }

  @Get()
  findAll() {
    return this.psEndpointsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // PAS de +id ici car l'ID est une string (ex: "101")
    return this.psEndpointsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePsEndpointDto: UpdatePsEndpointDto) {
    return this.psEndpointsService.update(id, updatePsEndpointDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.psEndpointsService.remove(id);
  }
}