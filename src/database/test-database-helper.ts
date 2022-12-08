import { DB_CONF_FIELDS } from '@config/constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

export const TestTypeOrmModules = (...entities: EntityClassOrSchema[]) => {
  return [
    ConfigModule.forRoot({
      envFilePath: ['.env.test'],
      isGlobal: false,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const typeOrmModuleOptions: TypeOrmModuleOptions = {
          type: 'postgres',
          url: configService.get<string>(DB_CONF_FIELDS.URL),
          entities: ['../../dist/src/**/*.entity.js'],
          autoLoadEntities: true,
          synchronize: false,
          applicationName: configService.get<string>(DB_CONF_FIELDS.DATABASE),
          ssl: false,
          dropSchema: false,
        };

        return typeOrmModuleOptions;
      },
    }),
    TypeOrmModule.forFeature(entities),
  ];
};
