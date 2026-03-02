import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateNewEndpointDto } from './dto/create-new_endpoint.dto';
import { PsAors } from '../ps_aors/entities/ps_aor.entity';
import { PsAuths } from '../ps_auths/entities/ps_auth.entity';
import { PsEndpoint } from '../ps_endpoints/entities/ps_endpoint.entity';

@Injectable()
export class NewEndpointService {
  constructor(private dataSource: DataSource) {}

  async create(createDto: CreateNewEndpointDto) {
    const { username, password, context } = createDto;
    
    const endpointId = username;
    const authId = `${username}-auth`;

    // Transaction SQL
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. AOR
      const aor = new PsAors();
      aor.id = endpointId;
      aor.max_contacts = 1;
      aor.remove_existing = 'yes';
      await queryRunner.manager.save(PsAors, aor);

      // 2. Auth
      const auth = new PsAuths();
      auth.id = authId;
      auth.auth_type = 'userpass';
      auth.username = username;
      auth.password = password;
      await queryRunner.manager.save(PsAuths, auth);

      // 3. Endpoint
      const endpoint = new PsEndpoint();
      endpoint.id = endpointId;
      endpoint.transport = 'transport-udp';
      endpoint.aors = endpointId;
      endpoint.auth = authId;
      endpoint.context = context || 'from-internal';
      endpoint.disallow = 'all';
      endpoint.allow = 'ulaw,alaw';
      endpoint.direct_media = 'yes';
      endpoint.force_rport = 'yes';
      endpoint.ice_support = 'yes';
      endpoint.rewrite_contact = 'yes';
      endpoint.rtp_symmetric = 'yes';
      
      await queryRunner.manager.save(PsEndpoint, endpoint);

      await queryRunner.commitTransaction();

      return {
        status: 'success',
        message: `Compte SIP ${username} créé avec succès (AOR+Auth+Endpoint).`,
      };

    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error(err);
      throw new InternalServerErrorException(`Erreur creation: ${err.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return { message: 'Utilisez ps-endpoints pour la lecture' };
  }

  async remove(username: string) {
    const endpointId = username;
    const authId = `${username}-auth`;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Supprimer Endpoint
      await queryRunner.manager.delete(PsEndpoint, endpointId);
      
      // 2. Supprimer Auth
      await queryRunner.manager.delete(PsAuths, authId);
      
      // 3. Supprimer AOR
      await queryRunner.manager.delete(PsAors, endpointId);

      await queryRunner.commitTransaction();

      return { message: `Compte SIP ${username} entièrement supprimé.` };

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`Erreur suppression: ${err.message}`);
    } finally {
      await queryRunner.release();
    }
  }

}