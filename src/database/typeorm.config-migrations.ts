import { DataSource } from 'typeorm';
import { typeOrmConfig } from './database-config.service';
export const dataSourceInstance = new DataSource(typeOrmConfig);
