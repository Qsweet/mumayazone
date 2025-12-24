
import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const type = formData.get("type") as string || "general"; // 'video' | 'material' | 'general'

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 });
        }

        // Validate File Type for Video
        if (type === 'video') {
            if (!file.type.startsWith('video/')) {
                return NextResponse.json({ error: "Invalid file type. Expected video." }, { status: 400 });
            }
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        // Sanitize filename
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const filename = `${Date.now()}_${safeName}`;

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), "public/uploads", type);
        await mkdir(uploadDir, { recursive: true });

        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);

        return NextResponse.json({
            url: `/uploads/${type}/${filename}`,
            success: true
        });

    } catch (error) {
        console.error("Upload failed:", error);
        return NextResponse.json({ error: "Upload failed." }, { status: 500 });
    }
}
