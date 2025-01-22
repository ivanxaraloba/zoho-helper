import { NextRequest, NextResponse } from "next/server";
import { json2xml } from "xml-js";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const converted = json2xml(json, { compact: true });

    return NextResponse.json({ data: converted, error: null }, { status: 200 });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: errorMessage, data: null },
      { status: 500 }
    );
  }
}
