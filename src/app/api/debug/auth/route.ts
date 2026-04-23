// Debug endpoint to check authentication
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';

// API routes will work on Vercel serverless functions

export async function GET(request: NextRequest) {
  try {
    console.log('Debug auth endpoint called');
    
    const user = await getCurrentUserFromRequest(request);
    
    return NextResponse.json({
      success: true,
      user: user ? {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      } : null,
      headers: {
        authorization: request.headers.get('authorization') ? 'Present' : 'Missing',
        contentType: request.headers.get('content-type')
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Debug auth error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
