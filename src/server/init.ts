import { exploitPollingService } from "~/lib/exploits/polling";
import { logger } from "~/lib/logger";
import { env } from "~/env";

export async function initializeServices(): Promise<void> {
  if (env.NODE_ENV === "production" || process.env.ENABLE_SERVICES === "true") {
    logger.info("Initializing server-side services");

    try {
      exploitPollingService.start();
      logger.info("Exploit polling service started successfully");
    } catch (error) {
      logger.error("Failed to start exploit polling service", { error });
    }
  } else {
    logger.info(
      "Skipping service initialization in development mode. Set ENABLE_SERVICES=true to enable.",
    );
  }
}
