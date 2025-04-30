import { PrismaClient, Prisma } from "@prisma/client";
import { DuneClient } from "@duneanalytics/client-sdk";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const duneApiKey = process.env.DUNE_API_KEY;
if (!duneApiKey) {
  throw new Error("DUNE_API_KEY is not set in the environment variables.");
}
const dune = new DuneClient(duneApiKey);
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

async function main() {
  console.log(`Fetching exploit data from Dune query ${DUNE_QUERY_ID}...`);

  try {
    const { result, error } = await dune.runQuery({
      queryId: DUNE_QUERY_ID,
    });

    if (error) {
      throw new Error(`Dune query error: ${error}`);
    }

    if (!result?.rows) {
      console.log("No rows returned from Dune query.");
      await prisma.$disconnect();
      return;
    }

    console.log(`Fetched ${result.rows.length} rows from Dune.`);
    console.log(`Transforming data for Prisma...`);

    const transformedData: TransformedExploitData[] = (
      result.rows as unknown as DuneExploitRow[]
    ).map((row) => {
      const hackDate = new Date(row.hack_date);
      return {
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
    });

    const validExploitData = transformedData.filter(
      (data) =>
        data.hackDate instanceof Date && !isNaN(data.hackDate.getTime()),
    );

    const invalidCount = transformedData.length - validExploitData.length;
    if (invalidCount > 0) {
      console.warn(
        `Filtered out ${invalidCount} rows with invalid date formats.`,
      );
    }

    if (validExploitData.length === 0) {
      console.log("No valid exploit data to seed after transformation.");
      await prisma.$disconnect();
      return;
    }

    console.log(
      `Start seeding ${validExploitData.length} valid exploits into the database...`,
    );

    const createResult = await prisma.exploit.createMany({
      data: validExploitData,
      skipDuplicates: true,
    });

    console.log(`Seeding finished. Added ${createResult.count} new exploits.`);
  } catch (error) {
    console.error("Error fetching or seeding data from Dune:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main()
  .then(async () => {})
  .catch(async (e) => {});
