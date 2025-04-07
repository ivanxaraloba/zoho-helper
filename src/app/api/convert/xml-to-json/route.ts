import { NextRequest, NextResponse } from "next/server";
import { xml2json } from "xml-js";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.xml) {
      return NextResponse.json(
        { error: "Missing xml property in request body", data: null },
        { status: 400 }
      );
    }

    const converted = xml2json(body.xml, { compact: true, spaces: 4 });

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
