import "./globals.css";
import Navbar from "@/components/Navbar";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartProvider } from "@/context/CartContext"; // 1. Ensure this is imported
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased text-stone-900 bg-white">
        {/* 2. Wrap EVERYTHING inside the providers */}
        <WishlistProvider>
          <CartProvider>
            <Navbar />
            <main className="pt-20">
              {children}
            </main>
          </CartProvider>
        </WishlistProvider>

        <Script 
          src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" 
          strategy="lazyOnload" 
        />
      </body>
    </html>
  );
}