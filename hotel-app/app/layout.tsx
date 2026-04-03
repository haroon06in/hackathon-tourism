import type { Metadata } from "next";
import { Manrope, Noto_Serif } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import { cn } from "../lib/utils";
import Providers from "../components/Providers";
import NavBar from "../components/NavBar";

const manrope = Manrope({
  subsets: ["latin"],
  variable: '--font-body',
});

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ['400', '700'],
  variable: '--font-headline',
});

export const metadata: Metadata = {
  title: "Kuriftu Resorts",
  description: "The Lakeside Curated Living",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(manrope.variable, notoSerif.variable, "light")}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface text-on-surface selection:bg-secondary-container min-h-screen flex flex-col font-body">
        <Providers>
          <NavBar />

          <main className="flex-grow w-full">
            {children}
          </main>
        </Providers>

        {/* Footer */}
        <footer className="bg-stone-50 dark:bg-stone-950 w-full relative mt-auto border-t border-outline-variant/20">
          <div className="flex flex-col md:flex-row justify-between items-center w-full px-6 md:px-12 py-16 gap-8 max-w-7xl mx-auto">
            <div className="font-serif text-lg text-stone-900 dark:text-stone-100 text-center md:text-left">
              Kuriftu Resorts & Spa
              <p className="font-sans text-xs text-stone-500 mt-1 uppercase tracking-[0.2em]">The Lakeside Curated Living</p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
              <a className="font-sans text-sm tracking-wide text-stone-500 dark:text-stone-400 hover:text-emerald-900 dark:hover:text-emerald-200 transition-all" href="#">Our Story</a>
              <a className="font-sans text-sm tracking-wide text-stone-500 dark:text-stone-400 hover:text-emerald-900 dark:hover:text-emerald-200 transition-all" href="#">Sustainability</a>
              <a className="font-sans text-sm tracking-wide text-stone-500 dark:text-stone-400 hover:text-emerald-900 dark:hover:text-emerald-200 transition-all underline decoration-1 text-emerald-800 dark:text-emerald-400" href="#">Wellness</a>
              <a className="font-sans text-sm tracking-wide text-stone-500 dark:text-stone-400 hover:text-emerald-900 dark:hover:text-emerald-200 transition-all" href="/concierge">Contact</a>
              <a className="font-sans text-sm tracking-wide text-stone-500 dark:text-stone-400 hover:text-emerald-900 dark:hover:text-emerald-200 transition-all" href="#">Press</a>
            </div>

            <div className="text-stone-500 dark:text-stone-400 font-sans text-[10px] tracking-widest text-center md:text-right">
              © {new Date().getFullYear()} Kuriftu Resorts & Spa. The Lakeside Curated Living.
            </div>
          </div>
        </footer>

        {/* Global Floating Action Button for Support (optional, directs to concierge) */}
        <Link href="/concierge">
          <button className="fixed bottom-8 right-8 w-14 h-14 bg-secondary text-on-secondary rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform z-40">
            <span className="material-symbols-outlined">chat_bubble</span>
          </button>
        </Link>
      </body>
    </html>
  );
}
