import { NextRequest, NextResponse } from "next/server";
import { xml2json } from "xml-js";

export async function POST(req: NextRequest) {
  try {
    const xml = await req.text();
    const converted = xml2json(xml, { compact: true, spaces: 4 });

    return NextResponse.json(
      { data: JSON.parse(converted), error: null },
      { status: 200 },
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: errorMessage, data: null },
      { status: 500 },
    );
  }
}
