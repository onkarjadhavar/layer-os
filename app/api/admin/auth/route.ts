import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_COOKIE_NAME,
  authenticateAdminCredentials,
  createAdminSessionPayload,
} from '@/lib/admin/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, totp } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const admin = authenticateAdminCredentials(email, password, totp);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin credentials or unauthorized account.' },
        { status: 401 }
      );
    }

    const sessionPayload = createAdminSessionPayload(admin);
    const response = NextResponse.json({ success: true, admin });

    // Set layeros_admin_session cookie (24h validity)
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: sessionPayload,
      path: '/',
      httpOnly: false, // Accessible to client-side admin components
      sameSite: 'lax',
      maxAge: 86400,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Authentication error' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: '',
    path: '/',
    maxAge: 0,
  });
  return response;
}
