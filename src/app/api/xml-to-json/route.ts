import { NextRequest, NextResponse } from "next/server";
import convert from "xml-js";

export async function POST(req: NextRequest) {
  try {
    const xmlString = await req.text();
    const converted = convert.xml2json(xmlString);

    return NextResponse.json(converted, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
