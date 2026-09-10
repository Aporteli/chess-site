export async function compressBoardImage(file: File): Promise<File> {
    try {
      const bmp = await createImageBitmap(file);
      const max = 1600;
      const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
      const w = Math.round(bmp.width * scale);
      const h = Math.round(bmp.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return file;
      ctx.drawImage(bmp, 0, 0, w, h);
      bmp.close();
      
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.85),
      );
      if (!blob) return file;
      return new File([blob], "board.jpg", { type: "image/jpeg" });
    } catch {
      return file;
    }
  }