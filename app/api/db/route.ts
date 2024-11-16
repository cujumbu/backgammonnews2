import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'data', 'news.db');

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  const length = parseInt(searchParams.get('length') || '0', 10);

  try {
    const buffer = readFileSync(DB_PATH);
    const slice = buffer.slice(offset, offset + length);
    
    return new NextResponse(slice, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': slice.length.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    console.error('Error reading database:', error);
    return new NextResponse(null, { status: 500 });
  }
}
