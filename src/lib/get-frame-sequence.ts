import fs from 'fs'
import path from 'path'

const FRAMES_DIR = path.join(process.cwd(), 'public/frames/server-to-laptop')
const FRAME_PATTERN = /frame_(\d+)/i
const IMAGE_EXT = /\.(webp|png|jpe?g)$/i

function extractFrameIndex(filename: string): number {
  const match = filename.match(FRAME_PATTERN)
  return match ? parseInt(match[1], 10) : 0
}

/** Reads the server-to-laptop frame directory and returns sorted public URL paths. */
export function getFrameSequence(): string[] {
  if (!fs.existsSync(FRAMES_DIR)) {
    return []
  }

  return fs
    .readdirSync(FRAMES_DIR)
    .filter((file) => IMAGE_EXT.test(file))
    .sort((a, b) => extractFrameIndex(a) - extractFrameIndex(b))
    .map((file) => `/frames/server-to-laptop/${file}`)
}
