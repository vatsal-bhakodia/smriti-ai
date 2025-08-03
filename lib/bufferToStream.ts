import { Readable } from "stream";
import cloudinary from "@/lib/cloudinary"; // adjust the path as needed

function bufferToStream(buffer: Buffer) {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
}

export async function uploadPDFBuffer(buffer: Buffer, filename: string) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        public_id: filename,
        format: "pdf",
        access_mode: "public",
        type: "upload",
        invalidate: true, // Clear cache
        overwrite: true, // Allow overwriting
        use_filename: true,
        unique_filename: false,
        access_control: [{ access_type: "anonymous" }] // Explicitly allow anonymous access
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    bufferToStream(buffer).pipe(uploadStream);
  });
}
