"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type ControllerRenderProps } from "react-hook-form";
import { z } from "zod";
import { api } from "~/trpc/react";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { toast as sonnerToast } from "sonner";

const formSchema = z.object({
  protocol: z.string().min(1, "Protocol name is required"),
  hackDate: z.string().refine((val) => val && !isNaN(Date.parse(val)), {
    message: "Please select a valid date",
  }),
  amountStolen: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount stolen must be a positive number",
    }),
  exploitType: z.string().min(1, "Exploit type is required"),
  technique: z.string().min(1, "Technique description is required"),
  relatedEntity: z.string().optional(),
  notes: z.string().optional(),
  submitterInfo: z
    .string()
    .email({ message: "Invalid email format" })
    .optional()
    .or(z.literal("")),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function SubmitExploitPage() {
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(
    null,
  );

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      protocol: "",
      hackDate: "",
      amountStolen: "",
      exploitType: "",
      technique: "",
      relatedEntity: "",
      notes: "",
      submitterInfo: "",
    },
  });

  const submitMutation = api.submissions.submitExploit.useMutation({
    onSuccess: (data) => {
      sonnerToast.success("Submission Successful!", {
        description: `Your exploit report for ${form.getValues("protocol")} has been received (ID: ${data.submissionId}). It will be reviewed shortly.`,
      });
      setSubmissionSuccess(data.submissionId);
      form.reset();
    },
    onError: (error) => {
      sonnerToast.error("Submission Failed", {
        description:
          error.message || "An unknown error occurred. Please try again.",
      });
      setSubmissionSuccess(null);
    },
  });

  function onSubmit(values: FormSchemaType) {
    submitMutation.mutate(values);
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Submit Exploit Details</h1>
        <Link href="/">
          <Button variant="outline">← Back to Dashboard</Button>
        </Link>
      </div>
      <p className="mb-8 text-center text-sm text-neutral-400">
        Contributing to the Solana Security Dashboard
      </p>

      {submissionSuccess ? (
        <div className="rounded-md border border-green-600 bg-green-900/30 p-6 text-center">
          <h2 className="mb-3 text-2xl font-semibold text-green-400">
            Thank You!
          </h2>
          <p className="mb-4 text-neutral-300">
            Your submission (ID: {submissionSuccess}) has been received and is
            pending review.
          </p>
          <Button onClick={() => setSubmissionSuccess(null)} variant="outline">
            Submit Another
          </Button>
          <Link href="/" className="ml-4">
            <Button variant="secondary">Back to Dashboard</Button>
          </Link>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="protocol"
              render={({
                field,
              }: {
                field: ControllerRenderProps<FormSchemaType, "protocol">;
              }) => (
                <FormItem>
                  <FormLabel>Protocol Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Mango Markets" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hackDate"
              render={({
                field,
              }: {
                field: ControllerRenderProps<FormSchemaType, "hackDate">;
              }) => (
                <FormItem>
                  <FormLabel>Date of Hack *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amountStolen"
              render={({
                field,
              }: {
                field: ControllerRenderProps<FormSchemaType, "amountStolen">;
              }) => (
                <FormItem>
                  <FormLabel>Amount Stolen (USD) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 1000000"
                      {...field}
                      step="0.01"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the estimated value in USD at the time of the hack.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="exploitType"
              render={({
                field,
              }: {
                field: ControllerRenderProps<FormSchemaType, "exploitType">;
              }) => (
                <FormItem>
                  <FormLabel>Exploit Type *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Oracle Manipulation, Flash Loan Attack"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Categorize the primary type of exploit used.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="technique"
              render={({
                field,
              }: {
                field: ControllerRenderProps<FormSchemaType, "technique">;
              }) => (
                <FormItem>
                  <FormLabel>Technique / Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe how the exploit was carried out..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a brief explanation of the vulnerability and method.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="relatedEntity"
              render={({
                field,
              }: {
                field: ControllerRenderProps<FormSchemaType, "relatedEntity">;
              }) => (
                <FormItem>
                  <FormLabel>Related Entity (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Attacker Address, Associated Protocol"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Any relevant addresses, protocols, or groups involved.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({
                field,
              }: {
                field: ControllerRenderProps<FormSchemaType, "notes">;
              }) => (
                <FormItem>
                  <FormLabel>Additional Notes / Links (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Links to post-mortems, news articles, transaction details, etc."
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="submitterInfo"
              render={({
                field,
              }: {
                field: ControllerRenderProps<FormSchemaType, "submitterInfo">;
              }) => (
                <FormItem>
                  <FormLabel>Your Email (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide your email if you&apos;d like to be contacted
                    regarding your submission.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={submitMutation.isPending}>
              {submitMutation.isPending ? "Submitting..." : "Submit Exploit"}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
