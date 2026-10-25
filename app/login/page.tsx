import { Metadata } from 'next';
import { LoginPageComponent } from '@/components/auth/LoginPageComponent';

export const metadata: Metadata = {
  title: 'LayerOS - लॉगिन (Login)',
  description: 'आपल्या पोल्ट्री फार्म खात्यात सुरक्षितपणे लॉगिन करा.',
};

export default function LoginPage() {
  return <LoginPageComponent />;
}
