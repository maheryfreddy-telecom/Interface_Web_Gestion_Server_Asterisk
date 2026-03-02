import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NewEndpointModule } from './new_endpoint/new_endpoint.module';
import { PsAorsModule } from './ps_aors/ps_aors.module';
import { PsAuthsModule } from './ps_auths/ps_auths.module';
import { PsEndpointsModule } from './ps_endpoints/ps_endpoints.module';
import { CdrModule } from './cdr/cdr.module';
import { PsContactsModule } from './ps_contacts/ps_contacts.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Configuration globale des variables d'environnement
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Configuration TypeORM avec variables d'environnement
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<'mariadb'>('DB_TYPE'),
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
    }),
    AuthModule,
    NewEndpointModule,
    PsAorsModule,
    PsAuthsModule,
    PsEndpointsModule,
    CdrModule,
    PsContactsModule,
  ],
})
export class AppModule {}