"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import ButtonLoading from "@/components/ui/button-loading";
import { ArrowRight, RefreshCw, Share2, FileJson, FileCode, Copy, Check, ChevronDown, Play } from "lucide-react";
import { useCopy } from "@/hooks/use-copy";
import { TypographyH1 } from "@/components/typography/typography-h1";
import { TypographyMuted } from "@/components/typography/typography-muted";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { APP_URL, METHOD_COLORS } from "@/utils/contants";


const apiRoutes = [
  {
    method: "POST",
    title: "Zoho Desk Migration Tool",
    description: "Transfer tickets, comments, attachments, and contacts between Zoho Desk instances",
    endpoint: "/api/migrate/desk",
    icon: <RefreshCw className="h-4 w-4" />,
    bodyParams: [
      {
        name: "ticketId",
        type: "string",
        description: "Optional. Specific ticket ID to migrate. If not provided, migrates multiple tickets",
        required: false
      }
    ],
    execute: async (data: object = {}) => {
      const response = await axios.post("/api/migrate/desk", data);
      return response.data;
    }
  },
  {
    method: "POST",
    title: "JSON to XML Converter",
    description: "Transform JSON data structures into XML format with preserved hierarchy",
    endpoint: "/api/convert/json-to-xml",
    icon: <FileJson className="h-4 w-4" />,
    bodyParams: [
      {
        name: "json",
        type: "object",
        description: "JSON object to convert to XML format",
        required: true
      }
    ]
  },
  {
    method: "POST",
    title: "XML to JSON Parser",
    description: "Convert XML documents into structured JSON objects with element preservation",
    endpoint: "/api/convert/xml-to-json",
    icon: <FileCode className="h-4 w-4" />,
    bodyParams: [
      {
        name: "xml",
        type: "string",
        description: "XML string to parse into JSON format",
        required: true
      }
    ]
  }
];

export default function Home() {
  const { copy, isCopied } = useCopy();

  return (
    <div className="max-w-screen-xl w-full mx-auto p-12">
      <div>
        <TypographyH1>API Routes</TypographyH1>
        <TypographyMuted>Select an API endpoint to interact with</TypographyMuted>
      </div>
      <div className="w-full space-y-6 mt-10">
        {apiRoutes.map((route) => (
          <Collapsible key={route.endpoint}>
            <Card>
              <CollapsibleTrigger className="text-start w-full">
                <CardHeader className="flex-row items-center py-3 px-6 gap-6">
                  <Badge variant="secondary" className="text-[10px] text-white" style={{ backgroundColor: METHOD_COLORS[route.method] }}>
                    {route.method}
                  </Badge>
                  <div className="space-y-1">
                    <CardTitle className="text-sm">{route.title}</CardTitle>
                    <CardDescription className="text-xs">{route.description}</CardDescription>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent className="border-t w-full">
                <CardContent className="space-y-4 py-3 px-6 w-full">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Request URL:</h4>
                    <div className="bg-secondary/50 rounded-md p-3 flex">
                      <code className="block w-full text-xs">
                        {APP_URL + route.endpoint}
                      </code>
                      <button onClick={() => copy(APP_URL + route.endpoint)}>
                        {isCopied(APP_URL + route.endpoint) ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  {route.bodyParams && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Body Parameters:</h4>
                      <div className="bg-secondary/50 rounded-md p-3">
                        <ul className="space-y-2">
                          {route.bodyParams.map((param, index) => (
                            <li key={index} className="text-xs">
                              <span className="font-semibold">{param.name}</span>
                              <span className="text-muted-foreground"> ({param.type})</span>
                              {param.required && <span className="text-red-500 ml-1">*</span>}
                              <br />
                              <span className="text-muted-foreground">{param.description}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}


                  <div className="w-full flex justify-end">
                    {route?.execute && (
                      <Button onClick={() => route.execute(route.bodyParams)}
                        variant="destructive">
                        <span>Execute</span>
                        <Play />
                      </Button>
                    )}
                  </div>
                </CardContent>

              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
