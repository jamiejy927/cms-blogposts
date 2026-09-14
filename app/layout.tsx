import type { Metadata } from 'next';
import { Cormorant_Garamond } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cormorant',
});

export const metadata: Metadata = {
  title: 'Movie & Animation Blog',
  description: 'Explore our latest movie and animation insights.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${cormorant.className} bg-sky-50/30 text-slate-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}