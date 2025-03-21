import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const specPath = path.join(process.cwd(), 'docs', 'api', 'openapi.json');
    
    const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
    
    return NextResponse.json(spec);
  } catch (error) {
    console.error('Error loading OpenAPI spec:', error);
    return NextResponse.json(
      { error: 'Failed to load API documentation' },
      { status: 500 }
    );
  }
}