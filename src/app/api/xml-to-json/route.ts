import { NextRequest, NextResponse } from "next/server";
import convert from "xml-js";

export async function POST(req: NextRequest) {
  try {
    const xmlString = await req.text();
    const converted = convert.xml2json(xmlString, { compact: true, spaces: 4 }); // You can specify options here

    return NextResponse.json(JSON.parse(converted), { status: 200 }); // Parse the JSON string before returning
  } catch (err: unknown) {
    // Check if err is an instance of Error for safer type handling
    const errorMessage =
      err instanceof Error ? err.message : "Failed to process request";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
