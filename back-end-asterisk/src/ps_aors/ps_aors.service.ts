import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { PsAors } from './entities/ps_aor.entity';
import { CreatePsAorsDto } from './dto/create-ps_aor.dto';
import { UpdatePsAorsDto } from './dto/update-ps_aor.dto';

@Injectable()
export class PsAorsService {
  constructor(
    @InjectRepository(PsAors)
    private psAorsRepository: Repository<PsAors>,
  ) {}

  async create(createPsAorsDto: CreatePsAorsDto) {
    const exists = await this.psAorsRepository.findOneBy({
      id: createPsAorsDto.id,
    });

    if (exists) {
      throw new ConflictException('AOR déjà existant');
    }

    const psAor = this.psAorsRepository.create(createPsAorsDto);
    return this.psAorsRepository.save(psAor);
  }

  async findAll(): Promise<PsAors[]> {
    return this.psAorsRepository.find();
  }

  async findOne(id: string): Promise<PsAors> {
    const aor = await this.psAorsRepository.findOneBy({ id });
    if (!aor) {
      throw new NotFoundException(`AOR with ID "${id}" not found`);
    }
    return aor;
  }

  async update(id: string, updatePsAorsDto: UpdatePsAorsDto): Promise<PsAors> {
    const aor = await this.findOne(id);
    const updated = Object.assign(aor, updatePsAorsDto);
    return this.psAorsRepository.save(updated);
  }

  async remove(id: string): Promise<DeleteResult> {
    const result = await this.psAorsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`AOR avec l'ID "${id}" introuvable`);
    }
    return result;
  }
}