"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";

export default function StoreProvider({ children, theme }: { children: React.ReactNode, theme: any }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar theme={theme} />
      <main className="flex-1">{children}</main>
      <Footer theme={theme} />
      <CartDrawer />
    </div>
  );
}
