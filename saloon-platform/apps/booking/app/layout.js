import { NetworkProvider } from '@saloon/network';
import './globals.css';

export const metadata = {
  title: 'SAloon Booking Module',
  description: 'A module for booking appointments',
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
