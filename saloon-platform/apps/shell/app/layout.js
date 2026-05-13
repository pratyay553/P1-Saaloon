import { NetworkProvider } from '@saloon/network';
import { AuthProvider } from './AuthProvider';
import { ThemeProvider } from './ThemeProvider';
import './globals.css';

export const metadata = {
  title: 'SAloon Platform',
  description: 'Salon Management Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NetworkProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </NetworkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
