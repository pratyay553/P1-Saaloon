import { NetworkProvider } from '@saloon/network';
import './globals.css';

export const metadata = {
  title: 'SAloon Booking',
  description: 'Premium Booking Experience',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NetworkProvider>
          {children}
        </NetworkProvider>
      </body>
    </html>
  );
}
