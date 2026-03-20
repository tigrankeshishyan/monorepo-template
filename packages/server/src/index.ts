import { createLogger } from "@app/shared-utils";
import { getDatabaseManager } from "@app/shared-db";
import { createHttpApp } from "./http-setup";

const logger = createLogger("bootstrap");
const PORT = parseInt(process.env["PORT"] ?? "3000", 10);

async function main(): Promise<void> {
  // Validate DB connectivity before accepting traffic
  const db = getDatabaseManager();
  const healthy = await db.healthCheck();
  if (!healthy) {
    logger.warn("Database health check failed — proceeding but DB operations may fail");
  } else {
    logger.info("Database connection verified");
  }

  const app = createHttpApp();

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`, { port: PORT, env: process.env["NODE_ENV"] });
  });
}

main().catch((err) => {
  console.error("Fatal startup error", err);
  process.exit(1);
});
