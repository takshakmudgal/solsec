import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    DUNE_API_KEY: z.string(),

    FLIPSIDE_API_KEY: z.string().optional(),
    HELIUS_API_KEY: z.string().optional(),

    EXPLOIT_DATA_PROVIDER: z
      .enum(["flipside", "helius"])
      .optional()
      .default("flipside"),

    EXPLOIT_POLL_INTERVAL: z.coerce.number().positive().default(15),
  },

  client: {},

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DUNE_API_KEY: process.env.DUNE_API_KEY,
    FLIPSIDE_API_KEY: process.env.FLIPSIDE_API_KEY,
    HELIUS_API_KEY: process.env.HELIUS_API_KEY,
    EXPLOIT_DATA_PROVIDER: process.env.EXPLOIT_DATA_PROVIDER,
    EXPLOIT_POLL_INTERVAL: process.env.EXPLOIT_POLL_INTERVAL,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  emptyStringAsUndefined: true,
});
