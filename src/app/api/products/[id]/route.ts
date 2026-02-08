import { connectToDB } from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request, 
  { params }: { params: Promise<{ id: string }> } // Change to Promise
) {
  try {
    await connectToDB();
    const { id } = await params; // Must await params here
    
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }
}

// Update the PATCH and DELETE methods in this same file similarly:
export async function PATCH(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const { id } = await params;
    const body = await req.json();
    const updatedProduct = await Product.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const { id } = await params;
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}