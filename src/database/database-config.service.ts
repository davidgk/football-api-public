import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { DB_CONF_FIELDS } from '@config/constants';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<any> => {
    return {
      type: 'postgres',
      host: configService.get(DB_CONF_FIELDS.HOST),
      port: parseInt(configService.get(DB_CONF_FIELDS.PORT)),
      database: configService.get(DB_CONF_FIELDS.DATABASE),
      username: configService.get(DB_CONF_FIELDS.USERNAME),
      password: configService.get(DB_CONF_FIELDS.PASSWORD),
      synchronize: Boolean(configService.get(DB_CONF_FIELDS.SYNCHRONIZE)),
      logging: Boolean(configService.get(DB_CONF_FIELDS.LOGGING)),
      migrationsRun: Boolean(configService.get(DB_CONF_FIELDS.MIGRATIONS)),
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/database/migrations/*.{ts,js}'],
      cli: {
        migrationsDir: __dirname + '/../migrations',
      },
      migrationsTableName: configService.get(DB_CONF_FIELDS.MIGRATIONS_TABLE),
      logger: configService.get(DB_CONF_FIELDS.LOGGER),
      autoLoadEntities: Boolean(
        configService.get(DB_CONF_FIELDS.AUTOLOAD_ENTITIES),
      ),
    };
  },
};

/***
 *  This connection is used to run migrations
 */
export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database:
    !process.env.NODE_ENV || process.env.NODE_ENV === 'test'
      ? 'football_api_test'
      : process.env.DB_DATABASE || 'football_api',
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  logging: Boolean(process.env.DB_LOGGING) || true,
  entities: ['./src/**/*.entity.ts'],
  migrations: ['./src/database/migrations/*.{ts,js}'],
  migrationsTableName: 'migrations',
};
