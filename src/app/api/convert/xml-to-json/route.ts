import { NextRequest, NextResponse } from "next/server";
import xml2json from '@hendt/xml2json';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.xml) {
      return NextResponse.json(
        { error: "Missing xml property in request body", data: null },
        { status: 400 }
      );
    }

    console.log(body.xml);
    const json = xml2json(body.xml); // Fixed typo here
    console.log(json);
    // const formattedJson = removeTextKey(json);

    return NextResponse.json(
      { data: json, error: null },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: errorMessage, data: null },
      { status: 500 },
    );
  }
}