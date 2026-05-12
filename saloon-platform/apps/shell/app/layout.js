import { NetworkProvider } from '@saloon/network';
import { AuthProvider } from './AuthProvider';
import './globals.css';

export const metadata = {
  title: 'SAloon Platform',
  description: 'Salon Management Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NetworkProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </NetworkProvider>
      </body>
    </html>
  );
}