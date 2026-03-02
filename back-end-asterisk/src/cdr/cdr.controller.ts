import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CdrService } from './cdr.service';
import { CreateCdrDto } from './dto/create-cdr.dto';
import { UpdateCdrDto } from './dto/update-cdr.dto';

@ApiTags('CDR')
@Controller('cdr')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CdrController {
  constructor(private readonly cdrService: CdrService) {}

  @Post()
  create(@Body() createCdrDto: CreateCdrDto) {
    return this.cdrService.create(createCdrDto);
  }

  @Get()
  findAll() {
    return this.cdrService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cdrService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCdrDto: UpdateCdrDto) {
    return this.cdrService.update(id, updateCdrDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cdrService.remove(id);
  }
}
