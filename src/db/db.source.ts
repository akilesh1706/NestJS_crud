import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";
import { UserEntity } from "./entities/user-entity";

export const DbConnection = [
  {
    provide: 'DataSource',
    useFactory: async (ConfigService: ConfigService) => {
      const datasource = new DataSource({
        type: 'postgres',
        host: ConfigService.get('DB_HOST'),
        port: ConfigService.get('DB_PORT'),
        username: ConfigService.get('DB_USERNAME'),
        password: ConfigService.get('DB_PASSWORD'),
        database: ConfigService.get('DB_NAME'),
        synchronize: true,
        entities:[
          UserEntity
        ],
        logging: true
      })
      return await datasource.initialize()
    },
    inject:[ConfigService]
  }
]