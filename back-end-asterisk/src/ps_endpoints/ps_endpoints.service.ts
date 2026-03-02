import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { PsEndpoint } from './entities/ps_endpoint.entity';
import { CreatePsEndpointDto } from './dto/create-ps_endpoint.dto';
import { UpdatePsEndpointDto } from './dto/update-ps_endpoint.dto';

@Injectable()
export class PsEndpointsService {
  constructor(
    @InjectRepository(PsEndpoint)
    private readonly psEndpointRepository: Repository<PsEndpoint>,
  ) {}

  async create(dto: CreatePsEndpointDto) {
    const exists = await this.psEndpointRepository.findOne({
      where: { id: dto.id },
    });

    if (exists) {
      throw new ConflictException('Endpoint déjà existant');
    }

    const endpoint = this.psEndpointRepository.create(dto);
    return this.psEndpointRepository.save(endpoint);
  }

  findAll() {
    return this.psEndpointRepository.find({
      select: [
        'id',
        'transport',
        'aors',
        'auth',
        'context',
        'disallow',
        'allow',
      ],
    });
  }

  findOne(id: string) {
    return this.psEndpointRepository.findOne({
      where: { id },
      select: [
        'id',
        'transport',
        'aors',
        'auth',
        'context',
        'disallow',
        'allow',
      ],
    });
  }

  async update(id: string, dto: UpdatePsEndpointDto): Promise<PsEndpoint> {
    // preload est utile pour fusionner les données
    const endpoint = await this.psEndpointRepository.preload({
      id: id,
      ...dto,
    });

    if (!endpoint) {
      throw new NotFoundException(`Endpoint avec l'ID "${id}" introuvable`);
    }

    return this.psEndpointRepository.save(endpoint);
  }

  async remove(id: string): Promise<DeleteResult> {
    const result = await this.psEndpointRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Endpoint avec l'ID "${id}" introuvable`);
    }
    return result;
  }
}