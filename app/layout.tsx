import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/components/StoreProvider";
import ReferralTracker from "@/components/ReferralTracker";
import { getThemeSettings } from "@/lib/theme";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: {
    default: "Deeksha Candles | Premium Handcrafted Candles",
    template: "%s | Deeksha Candles"
  },
  description: "Handcrafted with love and 100% pure organic soy & gel wax. Light up your special moments with our premium, eco-friendly scented candles.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getThemeSettings();

  return (
    <html
      lang="en"
      className={`${poppins.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <StoreProvider theme={theme}>
          <ReferralTracker />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
