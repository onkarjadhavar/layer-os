import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { EnrollPage } from '@/pages/EnrollPage';
import { AdminPage } from '@/pages/AdminPage';
import { AdminLoginPage } from '@/pages/AdminLoginPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard/farms/:farmId" element={<HomePage />} />
      <Route path="/dashboard/:farmId" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/enroll" element={<EnrollPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
export default AppRoutes;
