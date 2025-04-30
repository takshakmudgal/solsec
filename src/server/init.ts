import { exploitPollingService } from "~/lib/exploits/polling";
import { logger } from "~/lib/logger";
import { env } from "~/env";
import { db } from "~/server/db";
import { seedDatabase } from "../../prisma/seed";

let isInitialized = false;

export async function initializeServices(): Promise<void> {
  if (isInitialized) {
    return;
  }
  isInitialized = true;

  const shouldRunServices =
    env.NODE_ENV === "production" || process.env.ENABLE_SERVICES === "true";

  if (shouldRunServices) {
    logger.info("Initializing server-side services...");

    try {
      const exploitCount = await db.exploit.count();
      logger.info(`Found ${exploitCount} existing exploits in the database.`);

      if (exploitCount === 0) {
        logger.info("Database appears empty, attempting to seed...");
        try {
          await seedDatabase(db);
          logger.info("Database seeding completed successfully.");
        } catch (seedError) {
          logger.error(
            "Database seeding failed. Polling service will start with an empty/partially seeded database.",
            { seedError },
          );
        }
      } else {
        logger.info("Database already contains data, skipping seed.");
      }

      exploitPollingService.start();
      logger.info("Exploit polling service started successfully");
    } catch (error) {
      logger.error(
        "Failed to initialize server services (polling or initial check)",
        {
          error,
        },
      );
      isInitialized = false;
    }
  } else {
    logger.info(
      "Skipping service initialization in development mode (or ENABLE_SERVICES is not true).",
    );
    isInitialized = false;
  }
}
