'use client';

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAdminSession } from '@/lib/admin/auth';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Route protection guard for the Platform Admin Panel (/admin).
 * Redirects to /admin/login immediately if no active admin session exists.
 */
export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const location = useLocation();
  const session = getAdminSession();

  if (!session || !session.admin) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}

export default AdminProtectedRoute;

