import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PsContactsService } from './ps_contacts.service';
import { CreatePsContactDto } from './dto/create-ps_contact.dto';
import { UpdatePsContactDto } from './dto/update-ps_contact.dto';

@ApiTags('Contacts')
@Controller('ps-contacts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PsContactsController {
  constructor(private readonly psContactsService: PsContactsService) {}

  @Post()
  create(@Body() createPsContactDto: CreatePsContactDto) {
    return this.psContactsService.create(createPsContactDto);
  }

  @Get()
  findAll() {
    return this.psContactsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.psContactsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePsContactDto: UpdatePsContactDto) {
    return this.psContactsService.update(id, updatePsContactDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.psContactsService.remove(id);
  }
}
