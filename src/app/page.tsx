'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import ButtonLoading from '@/components/ui/button-loading';
import { ArrowRight, RefreshCw, Share2, FileJson, FileCode, Copy, Check, ChevronDown, Play } from 'lucide-react';
import { useCopy } from '@/hooks/use-copy';
import { TypographyH1 } from '@/components/typography/typography-h1';
import { TypographyMuted } from '@/components/typography/typography-muted';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { APP_URL, METHOD_COLORS } from '@/utils/contants';
import { log } from '@/utils/helpers';

const apiRoutes = [
  {
    method: 'POST',
    title: 'Zoho Desk Migration Tool',
    description: 'Transfer tickets, comments, attachments, and contacts between Zoho Desk instances',
    endpoint: '/api/migrate/desk',
    icon: <RefreshCw className="h-4 w-4" />,
    bodyParams: [
      {
        name: 'ticketId',
        type: 'string',
        description: 'Optional. Specific ticket ID to migrate. If not provided, migrates multiple tickets',
        required: false,
      },
    ],
    execute: async (data: object = {}) => {
      const response = await axios.post('/api/migrate/desk', data);
      return response.data;
    },
  },
  {
    method: 'POST',
    title: 'JSON to XML Converter',
    description: 'Transform JSON data structures into XML format with preserved hierarchy',
    endpoint: '/api/convert/json-to-xml',
    icon: <FileJson className="h-4 w-4" />,
    bodyParams: [
      {
        name: 'json',
        type: 'object',
        description: 'JSON object to convert to XML format',
        required: true,
      },
    ],
  },
  {
    method: 'POST',
    title: 'XML to JSON Parser',
    description: 'Convert XML documents into structured JSON objects with element preservation',
    endpoint: '/api/convert/xml-to-json',
    icon: <FileCode className="h-4 w-4" />,
    bodyParams: [
      {
        name: 'xml',
        type: 'string',
        description: 'XML string to parse into JSON format',
        required: true,
      },
    ],
  },
  // {
  //   method: 'POST',
  //   title: 'File Reader',
  //   description: 'Read file contents and metadata from the server',
  //   endpoint: '/api/files/read',
  //   icon: <FileCode className="h-4 w-4" />,
  //   bodyParams: [
  //     {
  //       name: 'filepath',
  //       type: 'string',
  //       description: 'Absolute path to the file to be read',
  //       required: true,
  //     },
  //   ],
  // },
];

export default function Home() {
  const { copy, isCopied } = useCopy();

  const teste = async () => {
    const response = await axios.post('/api/convert/xml-to-json', {
      xml: `<?xml version="1.0"?>
<catalog>
   <book id="bk101">
      <author>Gambardella, Matthew</author>
      <title>XML Developer's Guide</title>
      <genre>Computer</genre>
      <price>44.95</price>
      <publish_date>2000-10-01</publish_date>
      <description>An in-depth look at creating applications 
      with XML.</description>
   </book>
   <book id="bk102">
      <author>Ralls, Kim</author>
      <title>Midnight Rain</title>
      <genre>Fantasy</genre>
      <price>5.95</price>
      <publish_date>2000-12-16</publish_date>
      <description>A former architect battles corporate zombies, 
      an evil sorceress, and her own childhood to become queen 
      of the world.</description>
   </book>
   <book id="bk103">
      <author>Corets, Eva</author>
      <title>Maeve Ascendant</title>
      <genre>Fantasy</genre>
      <price>5.95</price>
      <publish_date>2000-11-17</publish_date>
      <description>After the collapse of a nanotechnology 
      society in England, the young survivors lay the 
      foundation for a new society.</description>
   </book>
   <book id="bk104">
      <author>Corets, Eva</author>
      <title>Oberon's Legacy</title>
      <genre>Fantasy</genre>
      <price>5.95</price>
      <publish_date>2001-03-10</publish_date>
      <description>In post-apocalypse England, the mysterious 
      agent known only as Oberon helps to create a new life 
      for the inhabitants of London. Sequel to Maeve 
      Ascendant.</description>
   </book>
   <book id="bk105">
      <author>Corets, Eva</author>
      <title>The Sundered Grail</title>
      <genre>Fantasy</genre>
      <price>5.95</price>
      <publish_date>2001-09-10</publish_date>
      <description>The two daughters of Maeve, half-sisters, 
      battle one another for control of England. Sequel to 
      Oberon's Legacy.</description>
   </book>
   <book id="bk106">
      <author>Randall, Cynthia</author>
      <title>Lover Birds</title>
      <genre>Romance</genre>
      <price>4.95</price>
      <publish_date>2000-09-02</publish_date>
      <description>When Carla meets Paul at an ornithology 
      conference, tempers fly as feathers get ruffled.</description>
   </book>
   <book id="bk107">
      <author>Thurman, Paula</author>
      <title>Splish Splash</title>
      <genre>Romance</genre>
      <price>4.95</price>
      <publish_date>2000-11-02</publish_date>
      <description>A deep sea diver finds true love twenty 
      thousand leagues beneath the sea.</description>
   </book>
   <book id="bk108">
      <author>Knorr, Stefan</author>
      <title>Creepy Crawlies</title>
      <genre>Horror</genre>
      <price>4.95</price>
      <publish_date>2000-12-06</publish_date>
      <description>An anthology of horror stories about roaches,
      centipedes, scorpions  and other insects.</description>
   </book>
   <book id="bk109">
      <author>Kress, Peter</author>
      <title>Paradox Lost</title>
      <genre>Science Fiction</genre>
      <price>6.95</price>
      <publish_date>2000-11-02</publish_date>
      <description>After an inadvertant trip through a Heisenberg
      Uncertainty Device, James Salway discovers the problems 
      of being quantum.</description>
   </book>
   <book id="bk110">
      <author>O'Brien, Tim</author>
      <title>Microsoft .NET: The Programming Bible</title>
      <genre>Computer</genre>
      <price>36.95</price>
      <publish_date>2000-12-09</publish_date>
      <description>Microsoft's .NET initiative is explored in 
      detail in this deep programmer's reference.</description>
   </book>
   <book id="bk111">
      <author>O'Brien, Tim</author>
      <title>MSXML3: A Comprehensive Guide</title>
      <genre>Computer</genre>
      <price>36.95</price>
      <publish_date>2000-12-01</publish_date>
      <description>The Microsoft MSXML3 parser is covered in 
      detail, with attention to XML DOM interfaces, XSLT processing, 
      SAX and more.</description>
   </book>
   <book id="bk112">
      <author>Galos, Mike</author>
      <title>Visual Studio 7: A Comprehensive Guide</title>
      <genre>Computer</genre>
      <price>49.95</price>
      <publish_date>2001-04-16</publish_date>
      <description>Microsoft Visual Studio 7 is explored in depth,
      looking at how Visual Basic, Visual C++, C#, and ASP+ are 
      integrated into a comprehensive development 
      environment.</description>
   </book>
</catalog>`,
    });
    console.log(response);
  };

  return (
    <div className="max-w-screen-xl w-full mx-auto p-12">
      <button onClick={teste}>teste</button>
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
                  <Badge
                    variant="secondary"
                    className="text-[10px] text-white"
                    style={{ backgroundColor: METHOD_COLORS[route.method] }}
                  >
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
                    <button
                      className="bg-secondary/50 rounded-md p-3 flex w-full text-start items-center"
                      onClick={() => copy(APP_URL + route.endpoint)}
                    >
                      <code className="block w-full text-xs">{APP_URL + route.endpoint}</code>
                      {isCopied(APP_URL + route.endpoint) ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
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
                      <Button size="sm" onClick={() => route.execute(route.bodyParams)} variant="destructive">
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
