import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { logger } from "~/lib/logger";
import { TRPCError } from "@trpc/server";

const submitExploitInputSchema = z.object({
  protocol: z.string().min(1, "Protocol name is required"),
  hackDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val)),
  amountStolen: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive("Amount stolen must be a positive number"),
  ),
  exploitType: z.string().min(1, "Exploit type is required"),
  technique: z.string().min(1, "Technique description is required"),
  relatedEntity: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  submitterInfo: z
    .string()
    .email("Invalid email format")
    .optional()
    .or(z.literal(""))
    .nullable(),
});

export const submissionRouter = createTRPCRouter({
  submitExploit: publicProcedure
    .input(submitExploitInputSchema)
    .mutation(async ({ input }) => {
      try {
        const newSubmission = await db.submittedExploit.create({
          data: {
            protocol: input.protocol,
            hackDate: input.hackDate,
            amountStolen: input.amountStolen,
            exploitType: input.exploitType,
            technique: input.technique,
            relatedEntity: input.relatedEntity,
            notes: input.notes,
            submitterInfo: input.submitterInfo ?? null,
          },
        });

        logger.info("Received new exploit submission", {
          id: newSubmission.id,
          protocol: newSubmission.protocol,
        });
        return { success: true, submissionId: newSubmission.id };
      } catch (error) {
        logger.error("Error saving exploit submission:", { error, input });

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to save exploit submission.",
          cause: error,
        });
      }
    }),
});
