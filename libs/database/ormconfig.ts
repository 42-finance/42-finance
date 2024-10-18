import { DataSource } from 'typeorm';

import { config } from './src/common/config';

export default new DataSource(config)
