import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/components/providers/QueryProvider'; // 1. Import the provider
import Navbar from '@/components/Navbar'; 
import { Toaster } from 'react-hot-toast';
import SocketInitializer from '@/components/SocketInitializer'; // 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Eventsphere',
  description: 'Discover and host events near you',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 2. Wrap the children with the QueryProvider */}
        <QueryProvider>
          <SocketInitializer/>
           <Toaster position="bottom-right" />
          <Navbar/>
          {children}</QueryProvider>
      </body>
    </html>
  );
}