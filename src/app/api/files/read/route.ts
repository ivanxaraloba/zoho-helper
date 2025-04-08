import { NextRequest, NextResponse } from "next/server";
import { fileTypeFromBuffer } from 'file-type';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded", data: null },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileType = await fileTypeFromBuffer(buffer);
        const content = buffer.toString('utf8');

        return NextResponse.json({
            data: {
                content,
                stats: {
                    name: file.name,
                    size: file.size,
                    type: file.type || fileType?.mime || 'unknown',
                    lastModified: new Date(file.lastModified),
                }
            },
            error: null
        }, { status: 200 });

    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        return NextResponse.json(
            { error: errorMessage, data: null },
            { status: 500 }
        );
    }
}
