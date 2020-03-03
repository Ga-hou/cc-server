// index.ts
import * as _ from 'lodash';
import { resolve } from 'path';

import productionConfig from './prod.config';
import { UserEntity } from '../system/user/user.entity';
import { RolesEntity } from '../system/roles/roles.entity';
import { UserRoleEntity } from '../system/relationalEntities/userRole/userRole.entity';
import { RoomEntity } from '../socket/room/room.entity';

const isProd = process.env.NODE_ENV === 'production';

let config = {
  port: 3000,
  hostName: 'localhost',

  orm: {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '000000',
    database: 'ccc',
    entities: [UserEntity, RolesEntity, UserRoleEntity, RoomEntity],
    migrations: ['migration/*.ts'],
    timezone: 'UTC',
    charset: 'utf8mb4',
    multipleStatements: true,
    dropSchema: false,
    synchronize: true,
    logging: false,
  },
};

if (isProd) {
  config = _.merge(config, productionConfig);
}

export { config };
export default config;
