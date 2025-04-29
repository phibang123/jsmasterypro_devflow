import type { Metadata } from 'next';
// import { Inter, Space_Grotesk as SpaceGrotesk } from "next/font/google";
import localFont from 'next/font/local';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import React from 'react';

import { auth } from '@/auth';
import { Toaster } from '@/components/ui/toaster';
import ThemeProvider from '@/context/Theme';

// Tải về
const inter = localFont({
  src: './fonts/InterVF.ttf',
  variable: '--font-inter',
  weight: '100 200 300 400 500 600 700 800 900',
});

const spaceGrotesk = localFont({
  src: './fonts/SpaceGroteskVF.ttf',
  variable: '--font-space-grotesk',
  weight: '300 400 500 600 700',
});

// Vì chúng tao có nextjs/font/google nên chúng ta có thể sữ dụng font của google thay vì tải về
// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-inter",
//   display: "swap",
// });

// const spaceGrotesk = SpaceGrotesk({
//   subsets: ["latin"],
//   variable: "--font-space-grotesk",
//   display: "swap",
// });

export const metadata: Metadata = {
  title: 'Dev Overflow',
  description:
    'A community-driven platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers from around the world. Explore topics in web development, mobile app development, algorithms, data structures, and more.',
  icons: {
    icon: '/images/site-logo.svg',
  },
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();
  return (
    <html
      lang="en"
      suppressContentEditableWarning
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <SessionProvider session={session}>
        <body
          // Đặt method là class name thì font chữ đó sẽ là font chữ mặc định
          className={`${inter.className} ${spaceGrotesk.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          <Toaster />
        </body>
      </SessionProvider>
    </html>
  );
};

export default RootLayout;
