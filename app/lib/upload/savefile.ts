// app/lib/upload/saveFile.ts
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export interface SaveFileOptions {
  folder?: string;       // subfolder inside public/uploads
  maxSizeMB?: number;    // default 5MB
  allowedTypes?: string[]; // default images only
}

export async function saveFile(
  file: File,
  identifier: string,
  options: SaveFileOptions = {}
): Promise<string> {
  const {
    folder = 'general',
    maxSizeMB = 5,
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  } = options;

  // Validate size
  if (file.size > maxSizeMB * 1024 * 1024) {
    throw new Error(`File size must be under ${maxSizeMB}MB`);
  }

  // Validate type
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type not allowed. Allowed: ${allowedTypes.join(', ')}`);
  }

  const ext = path.extname(file.name).toLowerCase();
  const filename = `${identifier}-${Date.now()}${ext}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);

  await mkdir(uploadDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  await writeFile(path.join(uploadDir, filename), Buffer.from(bytes));

  return `/uploads/${folder}/${filename}`;  // public URL
}

export async function deleteFile(publicUrl: string): Promise<void> {
  if (!publicUrl) return;
  const filePath = path.join(process.cwd(), 'public', publicUrl);
  if (existsSync(filePath)) {
    await unlink(filePath);
  }
}