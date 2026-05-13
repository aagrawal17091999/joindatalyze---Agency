import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import JSZip from 'jszip';
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

  const toolsDir = join(process.cwd(), 'public', 'tools');

  if (tool.bundleFiles && tool.bundleFiles.length > 0) {
    const zip = new JSZip();
    try {
      for (const name of tool.bundleFiles) {
        const buf = await readFile(join(toolsDir, name));
        zip.file(name, buf);
      }
    } catch (err) {
      console.error('[tool-downloads] Bundle file missing:', err);
      return NextResponse.json(
        { error: 'Tool file not found. Please contact support.' },
        { status: 404 },
      );
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    return new NextResponse(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${tool.filename}"`,
        'Content-Length': String(zipBuffer.length),
      },
    });
  }

  const filePath = join(toolsDir, tool.filename);

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
