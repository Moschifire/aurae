import "./globals.css";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased text-stone-900 bg-white">
        <Navbar />
        <div className="pt-20"> {/* Adds space so content isn't under the fixed navbar */}
          {children}
        </div>
      </body>
    </html>
  );
}