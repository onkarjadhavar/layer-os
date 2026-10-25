import { Metadata } from 'next';
import { EnrollmentWizard } from '@/components/enroll/EnrollmentWizard';

export const metadata: Metadata = {
  title: 'LayerOS - पोल्ट्री फार्म नोंदणी (Farm Enrollment)',
  description: 'आपला लेयर पोल्ट्री फार्म LayerOS प्रणालीवर नोंदवा आणि आधुनिक डिजिटल व्यवस्थापन सुरू करा.',
};

export default function EnrollPage() {
  return <EnrollmentWizard />;
}
