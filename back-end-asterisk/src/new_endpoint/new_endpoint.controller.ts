import { Controller, Post, Body, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NewEndpointService } from './new_endpoint.service';
import { CreateNewEndpointDto } from './dto/create-new_endpoint.dto';

@ApiTags('New Endpoint')
@Controller('new-endpoint')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NewEndpointController {
  constructor(private readonly newEndpointService: NewEndpointService) {}

  @Post()
  create(@Body() createNewEndpointDto: CreateNewEndpointDto) {
    return this.newEndpointService.create(createNewEndpointDto);
  }

  @Get()
  findAll() {
    return this.newEndpointService.findAll();
  }

  @Delete(':username')
  remove(@Param('username') username: string) {
    return this.newEndpointService.remove(username);
  }
}