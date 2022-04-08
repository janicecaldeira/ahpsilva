import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as dotenv from "dotenv";

dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  name: 'default',
  type: 'postgres',
  url: process.env.TYPEORM_URL,
  logging: true,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true
}
