import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PsAuthsService } from './ps_auths.service';
import { CreatePsAuthsDto } from './dto/create-ps_auth.dto';
import { UpdatePsAuthsDto } from './dto/update-ps_auth.dto';

@Controller('ps-auths')
export class PsAuthsController {
  constructor(private readonly psAuthsService: PsAuthsService) {}

  @Post()
  create(@Body() createPsAuthsDto: CreatePsAuthsDto) {
    return this.psAuthsService.create(createPsAuthsDto);
  }

  @Get()
  findAll() {
    return this.psAuthsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // PAS de +id ici car l'ID est une string (ex: "101-auth")
    return this.psAuthsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePsAuthsDto: UpdatePsAuthsDto) {
    return this.psAuthsService.update(id, updatePsAuthsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.psAuthsService.remove(id);
  }
}