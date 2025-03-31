import { setupServer } from "./server.js";
import { initMongoDB } from './db/initMongoDB.js';
import 'dotenv/config';
import { getEnvVar } from "./utils/getEnvVar.js";



const bootstrap = async () => {
  await initMongoDB();
  const app = setupServer();
  const port = Number(getEnvVar('PORT', 3000));
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

bootstrap();




