import * as dotenv from 'dotenv-flow';

// Load environment variables
dotenv.config({
  default_node_env: 'development'
});

export const config = {
  database: {
    url: process.env.DATABASE_URL,
  },
  service: {
    name: process.env.SERVICE_NAME,
    stage: process.env.STAGE,
    region: process.env.REGION,
    basePath: process.env.BASE_PATH,
  }
};
