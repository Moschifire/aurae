import "./globals.css";
import Navbar from "@/components/Navbar";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartProvider } from "@/context/CartContext"; // 1. Ensure this is imported
import Script from "next/script";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Auraé | Luxury Skincare, Beauty & Living",
    template: "%s | Auraé" // This adds "| Auraé" to the end of all sub-pages
  },
  description: "Experience Auraé: High-performance skincare (AuraéSkin), minimalist beauty (AuraéBeauty), and curated living essentials.",
  keywords: ["Skincare", "Beauty", "Luxury Fashion", "Auraé", "Home Decor"],
  metadataBase: new URL("https://aurae-six.vercel.app/"), // Replace with your Vercel URL
  openGraph: {
    title: "Auraé | Radiance Redefined",
    description: "Ethical, Minimalist, and Timeless Beauty.",
    images: [
      {
        url: "/og-image.jpg", // Create an image for social media previews
        width: 1200,
        height: 630,
      },
    ],
  },
};

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