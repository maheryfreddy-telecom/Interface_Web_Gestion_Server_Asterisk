import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PsContactsService } from './ps_contacts.service';
import { PsContactsController } from './ps_contacts.controller';
import { PsContact } from './entities/ps_contact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PsContact])],
  controllers: [PsContactsController],
  providers: [PsContactsService],
})
export class PsContactsModule {}