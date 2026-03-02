import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePsContactDto } from './dto/create-ps_contact.dto';
import { UpdatePsContactDto } from './dto/update-ps_contact.dto';
import { PsContact } from './entities/ps_contact.entity';

@Injectable()
export class PsContactsService {
  constructor(
    @InjectRepository(PsContact)
    private contactsRepository: Repository<PsContact>,
  ) {}

  async create(createDto: CreatePsContactDto): Promise<PsContact> {
    const contact = this.contactsRepository.create(createDto);
    return this.contactsRepository.save(contact);
  }

  findAll(): Promise<PsContact[]> {
    return this.contactsRepository.find();
  }

  // Attention: Ta requête disait 'endpoint: string' en entrée mais 'where: { endpoint }'
  // Si on cherche par l'ID principal, c'est 'id'. Si on cherche par endpoint associé :
  async findOne(id: string): Promise<PsContact> {
    const contact = await this.contactsRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Contact "${id}" not found.`);
    }
    return contact;
  }
  
  // Recherche spécifique par endpoint (colonne endpoint)
  async findByEndpoint(endpointName: string): Promise<PsContact[]> {
      return this.contactsRepository.find({ where: { endpoint: endpointName } });
  }

  async update(id: string, updateDto: UpdatePsContactDto): Promise<PsContact> {
    const contact = await this.findOne(id);
    this.contactsRepository.merge(contact, updateDto);
    return this.contactsRepository.save(contact);
  }

  async remove(id: string): Promise<void> {
    const result = await this.contactsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Contact "${id}" not found.`);
    }
  }
}