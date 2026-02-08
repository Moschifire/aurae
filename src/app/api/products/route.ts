import { connectToDB } from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const data = await req.json();
    const newProduct = await Product.create(data);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}