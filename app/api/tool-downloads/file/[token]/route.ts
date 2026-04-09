import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { verifyDownloadToken } from '@/lib/api/download-token';
import { TOOL_CONFIG } from '@/lib/data/tool-config';

type Params = { token: string };

export async function GET(
  _request: Request,
  { params }: { params: Promise<Params> },
) {
  const { token } = await params;

  const verified = verifyDownloadToken(token);
  if (!verified) {
    return NextResponse.json(
      {
        error:
          'Invalid or expired download link. Please request a new one.',
      },
      { status: 410 },
    );
  }

  const tool = TOOL_CONFIG[verified.toolId];
  if (!tool || !tool.filename) {
    return NextResponse.json({ error: 'Tool not found.' }, { status: 404 });
  }

  const filePath = join(process.cwd(), 'public', 'tools', tool.filename);

  let fileBuffer: Buffer;
  try {
    fileBuffer = await readFile(filePath);
  } catch (err) {
    console.error('[tool-downloads] File not found at:', filePath, err);
    return NextResponse.json(
      { error: 'Tool file not found. Please contact support.' },
      { status: 404 },
    );
  }

  const contentType = tool.filename.endsWith('.xlsx')
    ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    : 'application/octet-stream';

  return new NextResponse(new Uint8Array(fileBuffer), {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${tool.filename}"`,
      'Content-Length': String(fileBuffer.length),
    },
  });
}
