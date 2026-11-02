import type { Metadata, Viewport } from "next";
import { Figtree, League_Spartan } from "next/font/google";
import { MotionProvider } from "@/components/MotionProvider";
import { origin } from "@/lib/origin";
import { site } from "@/lib/site";
import "./globals.css";

const display = League_Spartan({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-league-spartan",
  display: "swap",
});

const text = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: site.title,
  description: site.description,
  authors: [{ name: site.name, url: site.portfolio }],
  openGraph: {
    title: site.title,
    description: site.description,
    url: "/",
    type: "website",
    siteName: site.brand,
    locale: "en_GB",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  // Lets the bottom controls sit clear of the home indicator (see env(safe-area-inset-bottom)).
  viewportFit: "cover",
  // In-app browsers that tint their chrome take the desk colour, so the folder sits in one field.
  themeColor: "#1e2722",
};

// Marks the page as scripted before first paint. CSS uses it to run the entrances and to fall
// back to plain #hash links when script is off.
const markScripted = `document.documentElement.classList.add("js")`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${display.variable} ${text.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: markScripted }} />
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
