import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere, DeleteResult } from 'typeorm';
import { Cdr } from './entities/cdr.entity';
import { CreateCdrDto } from './dto/create-cdr.dto';
import { UpdateCdrDto } from './dto/update-cdr.dto';

@Injectable()
export class CdrService {
  constructor(
    @InjectRepository(Cdr)
    private cdrRepository: Repository<Cdr>,
  ) {}

  async findByParticipant(id: string): Promise<Cdr[]> {
    return await this.cdrRepository.find({
      where: [
        { src: id },
        { dst: id }
      ],
      order: { start: 'DESC' } // CORRIGÉ: start au lieu de calldate
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 100,
    filters: Record<string, any> = {},
  ) {
    const skip = (page - 1) * limit;
    const where: FindOptionsWhere<Cdr> = {};

    if (filters.src) where.src = filters.src;
    if (filters.dst) where.dst = filters.dst;
    if (filters.disposition) where.disposition = filters.disposition;
    if (filters.uniqueid) where.uniqueid = filters.uniqueid;

    if (filters.startDate && filters.endDate) {
      // CORRIGÉ: start au lieu de calldate
      where.start = Between(new Date(filters.startDate), new Date(filters.endDate));
    }

    const [data, total] = await this.cdrRepository.findAndCount({
      where,
      take: limit,
      skip: skip,
      order: { start: 'DESC' }, // CORRIGÉ
    });

    return { data, total, page, limit };
  }

  async findOne(uniqueid: string): Promise<Cdr> {
    const cdr = await this.cdrRepository.findOneBy({ uniqueid });
    if (!cdr) throw new NotFoundException(`CDR "${uniqueid}" not found`);
    return cdr;
  }

  // Les CDR sont généralement en lecture seule, mais voici le code demandé
  async create(createCdrDto: CreateCdrDto): Promise<Cdr> {
    const cdr = this.cdrRepository.create(createCdrDto);
    return this.cdrRepository.save(cdr);
  }

  async update(uniqueid: string, updateCdrDto: UpdateCdrDto): Promise<Cdr> {
    await this.cdrRepository.update(uniqueid, updateCdrDto);
    return this.findOne(uniqueid);
  }

  async remove(uniqueid: string): Promise<DeleteResult> {
    const result = await this.cdrRepository.delete(uniqueid);
    if (result.affected === 0) throw new NotFoundException(`CDR "${uniqueid}" not found`);
    return result;
  }
}