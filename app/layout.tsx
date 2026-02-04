// app/layout.tsx
import type { Metadata } from 'next';
import { ThemeProvider } from './context/ThemeContext';
import { AppLayout } from './components/AppLayout';
import './globals.css';

export const metadata: Metadata = {
  title: 'Документация Africa RP',
  description: 'Официальная документация проекта',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className="min-h-screen bg-white dark:bg-gray-950">
        <ThemeProvider>
          <AppLayout>
            {children}
          </AppLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}