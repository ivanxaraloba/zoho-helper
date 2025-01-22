"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Form } from "@/components/ui/form";
import { TypographyMuted } from "@/components/typography/typography-muted";
import xmlFormatter from "xml-formatter";
import { ArrowUp, Check, Copy, Loader2, RotateCcw } from "lucide-react";
import Header from "../_components/header";
import { useCopy } from "@/hooks/use-copy";
import { cn } from "@/lib/utils";
import { APP_URL } from "@/utils/app";

const formSchema = z.object({
  input: z.string().min(1, "XML input is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function Home() {
  const endRef = useRef<HTMLDivElement | null>(null);

  const { copy, isCopied } = useCopy();
  const [responses, setResponses] = useState<responsesType>([]);

  useEffect(() => {
    if (endRef.current && responses.length > 0) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [responses]);

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: "",
    },
  });

  const mutationConvertXML = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post("/api/convert/json-to-xml", data.input);
      const formattedXML = response.data.data;
      if (!formattedXML) throw new Error("An error occurred");
      return formattedXML;
    },
    onSuccess: (data) => {
      setResponses((prev) => [
        ...prev,
        {
          input: form.getValues("input"),
          output: { status: true, result: data },
        },
      ]);
    },
    onError: (err: any) => {
      setResponses((prev) => [
        ...prev,
        {
          input: form.getValues("input"),
          output: {
            status: false,
            result: errorResponse?.response?.data.error || "An error occurred",
          },
        },
      ]);
      const errorResponse = err as { response?: { data: { error: string } } };
    },
  });

  const onSubmit = (data: FormData) => {
    mutationConvertXML.mutate(data);
    form.reset();
  };

  return (
    <div className="flex flex-col mx-auto w-full overflow-hidden h-full pb-3">
      {/* header & responses */}
      <div className="overflow-y-auto w-full h-full">
        <Header
          title="JSON to XML"
          apiRoute={`${APP_URL}/api/convert/json-to-xml`}
        />
        <div className=" flex flex-col w-full max-w-3xl mx-auto mt-3 gap-6">
          {responses.map((response, index) => (
            <div
              key={index}
              className="flex flex-col relative rounded-2xl bg-secondary"
            >
              {/* head */}
              <div className="w-full flex items-center h-9 px-4 rounded-t-2xl text-muted-foreground text-xs">
                <span className="truncate max-w-[60%] lg:max-w-[80%]">
                  {response.input.toString().substring(0, 180)}
                </span>
              </div>
              <div className="sticky top-24">
                <div className="absolute bottom-0 right-2 flex h-9 items-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="ml-auto !h-7 shadow-none text-muted-foreground"
                    onClick={() => copy(response.output.result, index)}
                  >
                    {isCopied(index) ? (
                      <>
                        <Check className="!size-3" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="!size-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <pre
                className={cn(
                  "whitespace-pre-wrap rounded-2xl rounded-t-none break-words p-4 text-sm bg-zinc-50 dark:bg-black",
                  !response.output.status && "text-destructive"
                )}
              >
                {!!response.output.status
                  ? xmlFormatter(response.output.result)
                  : response.output.result}
              </pre>
            </div>
          ))}
          <div ref={endRef} className="invisible" />
        </div>
      </div>
      {/* input */}
      <div
        className={cn(
          "mr-3 transition-all duration-700 ease-in-out",
          responses.length == 0 && "mb-96 scale-105"
        )}
      >
        <div className="max-w-3xl mx-auto w-full">
          <Form {...form}>
            <form
              id="form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="h-full flex-1"
            >
              <div className="relative">
                <Textarea
                  {...form.register("input")}
                  placeholder="Paste your JSON here..."
                  className="w-full h-28 p-4 rounded-2xl border !outline-none !ring-0 overflow-hidden resize-none shadow-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)();
                    }
                  }}
                />
                <div className="h-full absolute top-0 right-0 p-4 flex items-end gap-2">
                  <Button
                    variant="secondary"
                    className="size-8 rounded-full"
                    type="button"
                    onClick={() => setResponses([])}
                  >
                    <RotateCcw />
                  </Button>
                  <Button className="size-8 rounded-full" type="submit">
                    {mutationConvertXML.isPending ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <ArrowUp />
                    )}
                  </Button>
                </div>
              </div>
              <TypographyMuted className="text-center mt-2 text-xs">
                Press <kbd>enter</kbd> to submit
              </TypographyMuted>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
