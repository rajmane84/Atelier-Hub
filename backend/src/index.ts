import 'newrelic';
import app from './app';
import { prisma } from './util/prisma';
import { env } from './util/env';

const port = env.PORT;

async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
  } catch (error) {
    console.error(`❌ Database connection failed:`, (error as Error).message);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`✅ Server started on port ${port}`);
  });
}

startServer();
