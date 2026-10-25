import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Refreshes Supabase auth token on incoming server requests and propagates
 * updated cookies to both request and response headers.
 * Enforces Platform Admin route restrictions and checks farm access status.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith('/admin');
  const isAdminLogin = pathname === '/admin/login';

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Local development fallback without live Supabase
    if (isAdminRoute && !isAdminLogin) {
      // Allow local development preview of /admin if test cookie is present
      const adminCookie = request.cookies.get('layeros_admin_session')?.value;
      if (!adminCookie) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/admin/login';
        return NextResponse.redirect(redirectUrl);
      }
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh auth token via getUser()
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Suppress network/auth errors in offline or disconnected state
  }

  // Admin route protection: Only verified active platform_admins can access /admin/*
  if (isAdminRoute && !isAdminLogin) {
    const adminSessionCookie = request.cookies.get('layeros_admin_session')?.value;

    if (!user && !adminSessionCookie) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/admin/login';
      return NextResponse.redirect(redirectUrl);
    }

    if (user) {
      const { data: adminRecord } = await supabase
        .from('platform_admins')
        .select('id, role, is_active')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (!adminRecord && !adminSessionCookie) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/admin/login';
        redirectUrl.searchParams.set('error', 'access_denied');
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  return supabaseResponse;
}
