"use client";
import { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext<any>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<any[]>([]);

  // Load from local storage once on mount
  useEffect(() => {
    const saved = localStorage.getItem("aurae_wishlist");
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse wishlist", e);
      }
    }
  }, []);

  const toggleWishlist = (product: any) => {
    setWishlist((prev) => {
      // Safety check for ID
      const productId = product._id.toString();
      const exists = prev.find((item) => item._id.toString() === productId);

      let updated;
      if (exists) {
        // Remove item if it already exists
        updated = prev.filter((item) => item._id.toString() !== productId);
      } else {
        // Add item if it doesn't
        updated = [...prev, product];
      }

      localStorage.setItem("aurae_wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

// Ensure this only appears ONCE at the bottom of the file
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider. Check your layout.tsx!");
  }
  return context;
};