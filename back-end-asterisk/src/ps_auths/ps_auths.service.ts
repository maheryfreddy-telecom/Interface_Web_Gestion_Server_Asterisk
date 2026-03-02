import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { PsAuths } from './entities/ps_auth.entity';
import { CreatePsAuthsDto } from './dto/create-ps_auth.dto';
import { UpdatePsAuthsDto } from './dto/update-ps_auth.dto';

@Injectable()
export class PsAuthsService {
  constructor(
    @InjectRepository(PsAuths)
    private psAuthsRepository: Repository<PsAuths>,
  ) {}

  async create(createPsAuthsDto: CreatePsAuthsDto): Promise<PsAuths> {
    const exists = await this.psAuthsRepository.findOneBy({
      id: createPsAuthsDto.id,
    });

    if (exists) {
      throw new ConflictException('Cet utilisateur (Auth) existe déjà');
    }

    const psAuth = this.psAuthsRepository.create(createPsAuthsDto);
    return this.psAuthsRepository.save(psAuth);
  }

  async findAll(): Promise<PsAuths[]> {
    return this.psAuthsRepository.find();
  }

  async findOne(id: string): Promise<PsAuths> {
    const auth = await this.psAuthsRepository.findOneBy({ id });
    if (!auth) {
      throw new NotFoundException(`Auth ID "${id}" not found`);
    }
    return auth;
  }

  async update(id: string, updatePsAuthsDto: UpdatePsAuthsDto): Promise<PsAuths> {
    const auth = await this.findOne(id);
    const updated = Object.assign(auth, updatePsAuthsDto);
    return this.psAuthsRepository.save(updated);
  }

  async remove(id: string): Promise<DeleteResult> {
    const result = await this.psAuthsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Auth ID "${id}" introuvable`);
    }
    return result;
  }
}