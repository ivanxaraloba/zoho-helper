import { NextRequest, NextResponse } from "next/server";
import { xml2json } from "xml-js";


const removeTextKey = (obj: any) => {
  if (typeof obj !== 'object' || obj === null) return obj;

  if (obj.hasOwnProperty('_text')) return obj._text;

  for (const key in obj) {
    obj[key] = removeTextKey(obj[key]);
  }

  return obj;
};


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.xml) {
      return NextResponse.json(
        { error: "Missing xml property in request body", data: null },
        { status: 400 }
      );
    }

    const converted = xml2json(body.xml, { compact: true, spaces: 4, });

    return NextResponse.json(
      { data: removeTextKey(JSON.parse(converted)), error: null },
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
