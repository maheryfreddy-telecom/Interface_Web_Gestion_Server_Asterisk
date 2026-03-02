import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PsAorsService } from './ps_aors.service';
import { CreatePsAorsDto } from './dto/create-ps_aor.dto';
import { UpdatePsAorsDto } from './dto/update-ps_aor.dto';

@Controller('ps-aors')
export class PsAorsController {
  constructor(private readonly psAorsService: PsAorsService) {}

  @Post()
  create(@Body() createPsAorsDto: CreatePsAorsDto) {
    return this.psAorsService.create(createPsAorsDto);
  }

  @Get()
  findAll() {
    return this.psAorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.psAorsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePsAorsDto: UpdatePsAorsDto) {
    return this.psAorsService.update(id, updatePsAorsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.psAorsService.remove(id);
  }
}