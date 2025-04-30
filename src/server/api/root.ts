import { postRouter } from "~/server/api/routers/post";
import { exploitsRouter } from "~/server/api/routers/exploits";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { submissionRouter } from "./routers/submissions";

export const appRouter = createTRPCRouter({
  post: postRouter,
  exploits: exploitsRouter,
  submissions: submissionRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
