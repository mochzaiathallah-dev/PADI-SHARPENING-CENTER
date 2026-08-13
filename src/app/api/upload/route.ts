import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "image/png";

    // Attempt writing to local disk (works in local dev environment)
    try {
      const uploadsDir = join(process.cwd(), "public", "uploads");
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      const timestamp = Date.now();
      const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const ext = originalName.split(".").pop()?.toLowerCase() || "bin";
      const filename = `${timestamp}_${originalName.replace(`.${ext}`, "")}.${ext}`;
      const filepath = join(uploadsDir, filename);

      await writeFile(filepath, buffer);

      const publicUrl = `/uploads/${filename}`;
      return NextResponse.json({ url: publicUrl });
    } catch (fsError: any) {
      // Vercel serverless environment has a read-only filesystem (EROFS).
      // Fallback: convert file to compressed Base64 Data URL for zero-disk-write Vercel compatibility
      console.warn("[upload] Local filesystem is read-only (Vercel deployment mode). Falling back to Data URL encoding.");
      const base64 = buffer.toString("base64");
      const dataUrl = `data:${mimeType};base64,${base64}`;
      return NextResponse.json({ url: dataUrl });
    }
  } catch (error) {
    console.error("[upload] Error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
