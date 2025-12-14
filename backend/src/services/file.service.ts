import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';

export async function createTempFile(buffer: Buffer, extension = '.webm'): Promise<string> {
  const tempDir = os.tmpdir();
  const filePath = path.join(tempDir, `${uuidv4()}${extension}`);
  await fs.promises.writeFile(filePath, buffer);
  return filePath;
}

export async function deleteTempFile(filePath: string): Promise<void> {
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    console.error(`Failed to delete temp file ${filePath}:`, error);
  }
}