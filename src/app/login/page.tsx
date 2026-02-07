"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid admin credentials");
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow-xl rounded-lg w-96 border border-gray-100">
        <h1 className="text-2xl font-serif mb-6 text-center text-gray-800">Auraé Admin</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input 
          type="email" placeholder="Admin Email" 
          className="w-full p-2 mb-4 border rounded outline-none focus:ring-1 focus:ring-black"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" placeholder="Password" 
          className="w-full p-2 mb-6 border rounded outline-none focus:ring-1 focus:ring-black"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
          Enter Dashboard
        </button>
      </form>
    </div>
  );
}