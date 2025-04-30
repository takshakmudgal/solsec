import { DuneClient } from "@duneanalytics/client-sdk";
import { env } from "~/env";

export const dune = new DuneClient(env.DUNE_API_KEY || "");
