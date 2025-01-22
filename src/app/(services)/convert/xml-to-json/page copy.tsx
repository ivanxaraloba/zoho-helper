"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import ButtonLoading from "@/components/ui/button-loading";
import { Form } from "@/components/ui/form";
import { TypographyMuted } from "@/components/typography/typography-muted";
import Header from "../_components/header";
import { APP_URL } from "@/utils/app";

const formSchema = z.object({
  input: z.string().min(1, "XML input is required"),
});

type FormData = z.infer<typeof formSchema>;
export default function Home() {
  const [responseData, setResponseData] = useState<string>("");
  const [error, setError] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: "",
    },
  });

  const mutationConvertXML = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post("/api/convert/xml-to-json", data.input);
      setResponseData(response.data.data);
    },
    onSuccess: async (data: any) => {
      toast.success("Conversion successful!");
    },
    onError: (err: any) => {
      const errorResponse = err as { response?: { data: { error: string } } };
      setError(errorResponse.response?.data.error || "An error occurred");
      toast.error(err.message || "Error during conversion");
    },
  });

  const onSubmit = (data: FormData) => {
    setError("");
    setResponseData("");
    mutationConvertXML.mutate(data);
  };

  return (
    <div className="">
      <Header
        title="XML to JSON"
        apiRoute={`${APP_URL}/api/convert/xml-to-json`}
      />
      <div className="grid grid-cols-2 gap-10 mt-10">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mx-auto"
            >
              <Textarea
                {...form.register("input")}
                placeholder="Paste your XML here..."
                className="w-full h-96 p-4 border border-gray-300 rounded-md focus:outline-none"
              />
              <ButtonLoading
                className="w-full p-6"
                type="submit"
                loading={mutationConvertXML.isPending}
              >
                Convert
              </ButtonLoading>
            </form>
          </Form>
          {error && <p className="text-red-500 text-center mt-6">{error}</p>}
        </div>
        <div className="w-full min-h-96 p-4 border border-gray-300 rounded-md">
          <TypographyMuted>JSON Output: </TypographyMuted>
          {responseData && (
            <pre className="whitespace-pre-wrap break-words mt-2">
              {JSON.stringify(responseData, null, 4)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
