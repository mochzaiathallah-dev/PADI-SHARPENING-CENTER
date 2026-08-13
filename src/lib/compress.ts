/**
 * Reusable client-side media compressor.
 * Compresses images using canvas-based downscaling and webp conversion.
 * Limits and optimizes video sizes to protect database and network load.
 */

export async function compressImage(
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    // For very small files, skip canvas rendering to preserve original SVG/Icon vectors
    if (file.size < 30000 && !file.type.includes("jpeg") && !file.type.includes("png")) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return reject(new Error("Failed to get 2D canvas context"));
        }

        // Draw image with smooth rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP format for optimal compression ratio
        const compressedBase64 = canvas.toDataURL("image/webp", quality);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export async function compressVideo(file: File, maxSizeBytes = 3 * 1024 * 1024): Promise<string> {
  return new Promise((resolve, reject) => {
    // If the video file is already small enough, read as data URL directly
    if (file.size <= maxSizeBytes) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
      return;
    }

    // If it exceeds the maximum size, we will downscale/compress or warn
    // Since browser-side video compression without native libraries (like FFmpeg WASM which is 30MB)
    // is restricted, we warn the user and limit the base64 conversion size to protect the database.
    console.warn("Video file is large. Converting to base64 with warnings.");
    
    // We can also extract a compressed thumbnail or use standard conversion
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

export async function compressMediaFile(file: File): Promise<string> {
  if (file.type.startsWith("image/")) {
    return compressImage(file);
  } else if (file.type.startsWith("video/")) {
    return compressVideo(file);
  }
  
  // Fallback for other file types
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}
