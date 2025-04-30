import { PrismaClient, Prisma, type Exploit } from "@prisma/client";
import { DuneClient } from "@duneanalytics/client-sdk";
import dotenv from "dotenv";
import { logger } from "~/lib/logger";
import type { db as DbType } from "~/server/db";
import { fileURLToPath } from "url";

dotenv.config();

const duneApiKey = process.env.DUNE_API_KEY;
const DUNE_QUERY_ID = 5064259;

interface DuneExploitRow {
  protocol: string;
  hack_date: string;
  amount_stolen_usd: number;
  exploit_type: string;
  technique: string;
  related_entity: string | null;
  recovered: boolean | string;
  resolution: string | null;
  audited_by: string | null;
  notes: string | null;
}

type TransformedExploitData = Omit<
  Prisma.ExploitCreateInput,
  "id" | "createdAt" | "updatedAt"
>;

async function fetchAndTransformFromDune(): Promise<TransformedExploitData[]> {
  if (!duneApiKey) {
    throw new Error("DUNE_API_KEY is not set in the environment variables.");
  }
  const dune = new DuneClient(duneApiKey);

  logger.info(`Fetching exploit data from Dune query ${DUNE_QUERY_ID}...`);

  const { result, error } = await dune.runQuery({
    queryId: DUNE_QUERY_ID,
  });

  if (error) {
    throw new Error(`Dune query error: ${error}`);
  }

  if (!result?.rows) {
    logger.info("No rows returned from Dune query.");
    return [];
  }

  logger.info(`Fetched ${result.rows.length} rows from Dune.`);
  logger.info(`Transforming data for Prisma...`);

  const mappedData: (TransformedExploitData | null)[] = (
    result.rows as unknown as DuneExploitRow[]
  ).map((row) => {
    const hackDate = new Date(row.hack_date);
    if (isNaN(hackDate.getTime())) {
      logger.warn(
        `Invalid date format for protocol ${row.protocol}: ${row.hack_date}. Skipping row.`,
      );
      return null;
    }
    const data: TransformedExploitData = {
      protocol: row.protocol,
      hackDate: hackDate,
      amountStolen: row.amount_stolen_usd,
      exploitType: row.exploit_type,
      technique: row.technique,
      relatedEntity: row.related_entity,
      recovered:
        typeof row.recovered === "string"
          ? row.recovered.toLowerCase() === "true"
          : Boolean(row.recovered),
      resolution: row.resolution,
      auditedBy: row.audited_by,
      notes: row.notes,
    };
    return data;
  });

  const transformedData = mappedData.filter((data) => data !== null);

  const invalidCount = result.rows.length - transformedData.length;
  if (invalidCount > 0) {
    logger.warn(
      `Filtered out ${invalidCount} rows due to invalid date formats during transformation.`,
    );
  }

  return transformedData;
}

export async function seedDatabase(prisma: typeof DbType): Promise<void> {
  logger.info("Attempting to seed database...");
  try {
    const exploitData = await fetchAndTransformFromDune();

    if (exploitData.length === 0) {
      logger.info("No valid exploit data fetched from Dune to seed.");
      return;
    }

    logger.info(
      `Attempting to seed ${exploitData.length} valid exploits into the database...`,
    );

    const createResult = await prisma.exploit.createMany({
      data: exploitData,
      skipDuplicates: true,
    });

    logger.info(`Seeding finished. Added ${createResult.count} new exploits.`);
  } catch (error) {
    logger.error("Error during database seeding process:", { error });
    throw error;
  }
}

// ESM check to see if the script is run directly
const metaUrl = import.meta.url;
if (metaUrl && fileURLToPath(metaUrl) === process.argv[1]) {
  const prismaStandalone = new PrismaClient();
  seedDatabase(prismaStandalone)
    .catch(async (e) => {
      logger.error("Standalone seeding script failed:", { error: e });
      await prismaStandalone.$disconnect();
      process.exit(1);
    })
    .finally(async () => {
      await prismaStandalone.$disconnect();
    });
}
