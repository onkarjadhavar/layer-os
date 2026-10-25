import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/lib/theme/context';
import { I18nProvider } from '@/lib/i18n/context';
import { LayerOSProvider } from '@/lib/store';
import { PWAProvider } from '@/components/pwa/PWAProvider';
import { AppRoutes } from './routes';

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <I18nProvider>
          <LayerOSProvider>
            <PWAProvider>
              <AppRoutes />
            </PWAProvider>
          </LayerOSProvider>
        </I18nProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
export default App;
