import { NextResponse } from 'next/server';
import { mockHotels } from '../../../lib/mockData';

export async function GET() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return NextResponse.json(mockHotels);
}
